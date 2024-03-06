import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';

import { Firestore, setDoc, doc, getDoc } from '@angular/fire/firestore';
import { FirestoreUser } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userDataSubject: BehaviorSubject<FirestoreUser | null> =
    new BehaviorSubject<FirestoreUser | null>(null);
  userData$: Observable<FirestoreUser | null> = this.userDataSubject.asObservable();

  constructor(private firestore: Firestore, public router: Router) {
    const savedUserData = localStorage.getItem('user');
    if (savedUserData) {
      const parsedUserData = JSON.parse(savedUserData);
      this.userDataSubject.next(parsedUserData);
    }
  }

  async registerUser(
    email: string,
    password: string,
    additionalAuthData: FirestoreUser
  ) {
    try {
      const userCredential = await this.createUserWithEmailAndPassword(
        email,
        password
      );
      const uid = userCredential.user.uid;
      await this.addAdditionalAuthData(uid, additionalAuthData);
      await this.saveUserData(userCredential.user, additionalAuthData);
      this.router.navigate(['recipes-list']);
    } catch (error) {
      this.handleError(error);
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const userCredential = await this.signInWithEmailAndPassword(
        email,
        password
      );
      const uid = userCredential.user.uid;
      const additionalAuthData = await this.getAdditionalAuthDataById(uid);
      await this.saveUserData(userCredential.user, additionalAuthData);
      this.router.navigate(['recipes-list']);
    } catch (error) {
      this.handleError(error);
    }
  }

  async logoutUser() {
    try {
      await this.signOutAuth();
      await this.clearUserData();
      this.router.navigate(['sign-in']);
    } catch (error) {
      this.handleError(error);
    }
  }

  async forgotPassword(passwordResetEmail: string) {
    try {
      await this.sendPasswordResetEmail(passwordResetEmail);
      window.alert('Password reset email sent, check your inbox.');
      this.router.navigate(['sign-in']);
    } catch (error) {
      this.handleError(error);
      window.alert(error);
    }
  }

  private sendPasswordResetEmail(passwordResetEmail: string): Promise<void> {
    const auth = getAuth();
    return sendPasswordResetEmail(auth, passwordResetEmail);
  }

  private createUserWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<UserCredential> {
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password);
  }

  private signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<UserCredential> {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
  }

  private signOutAuth(): Promise<void> {
    const auth = getAuth();
    return signOut(auth);
  }

  private addAdditionalAuthData(
    uid: string,
    additionalAuthData: FirestoreUser
  ): Promise<void> {
    const collectionName = 'Auth';
    return setDoc(doc(this.firestore, collectionName, uid), additionalAuthData);
  }

  private async getAdditionalAuthDataById(
    uid: string
  ): Promise<FirestoreUser | null> {
    const authDocRef = doc(this.firestore, 'Auth', uid);
    const authSnapshot = await getDoc(authDocRef);

    if (authSnapshot.exists()) {
      return authSnapshot.data() as FirestoreUser;
    } else {
      return null;
    }
  }

  private saveUserData(
    user: User,
    additionalAuthData: FirestoreUser | null
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (user && additionalAuthData) {
        const fullAuthData = { ...user, ...additionalAuthData };
        localStorage.setItem('user', JSON.stringify(fullAuthData));
        this.userDataSubject.next(fullAuthData);
        resolve();
      } else {
        localStorage.setItem('user', 'null');
        this.userDataSubject.next(null);
        reject();
      }
    });
  }

  private clearUserData(): Promise<void> {
    return new Promise((resolve, reject) => {
      localStorage.removeItem('user');
      this.userDataSubject.next(null);
      resolve();
    });
  }

  private handleError(error: any): void {
    if (error instanceof Error) {
      const errorCode = (error as Error).name;
      const errorMessage = (error as Error).message;
      console.error(`Error (${errorCode}): ${errorMessage}`);
      alert(errorMessage);
    } else {
      console.error('Unknown error:', error);
      alert(error);
    }
  }
}
