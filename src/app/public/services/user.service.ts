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
  deleteUser,
} from 'firebase/auth';
import { BehaviorSubject, Observable, take } from 'rxjs';

import {
  Firestore,
  setDoc,
  doc,
  getDoc,
  arrayRemove,
  updateDoc,
  arrayUnion,
} from '@angular/fire/firestore';
import { FirestoreUser } from '../interfaces/interfaces';
import { CustomAlertService } from '../custom-alert/custom-alert.service';
import { GlobalErrorHandlerService } from './globalErrorHandler/global-error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userDataSubject: BehaviorSubject<FirestoreUser | null> =
    new BehaviorSubject<FirestoreUser | null>(null);
  userData$: Observable<FirestoreUser | null> =
    this.userDataSubject.asObservable();

  collectionName = 'Auth';

  constructor(
    private firestore: Firestore,
    public router: Router,
    private globalErrorHandler: GlobalErrorHandlerService
  ) {
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
      this.globalErrorHandler.handleError(error);
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
      await this.router.navigate(['recipes-list']);
    } catch (error) {
      this.globalErrorHandler.handleError(error);
    }
  }

  async logoutUser() {
    try {
      await this.signOutAuth();
      await this.clearUserData();
      this.router.navigate(['login']);
    } catch (error) {
      console.error(error);
    }
  }

  async deleteUserAccount(): Promise<void> {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        await deleteUser(user);
        await this.clearUserData();
        this.router.navigate(['login']);
      } else {
        throw new Error('No user found to delete.');
      }
    } catch (error) {
      this.globalErrorHandler.handleError(error);
    }
  }

  async forgotPassword(passwordResetEmail: string) {
    try {
      await this.sendPasswordResetEmail(passwordResetEmail);
      const errorMessage = 'Password reset email sent, check your inbox.';

      this.globalErrorHandler.handleError(errorMessage);

      await this.router.navigate(['login']);
    } catch (error) {
      this.globalErrorHandler.handleError(error);
    }
  }

  async updateFavoriteRecipes(recipeId: string, userId: string, add: boolean) {
    const docRef = doc(this.firestore, this.collectionName, userId);

    try {
      if (!add) {
        console.log('add');

        await updateDoc(docRef, {
          favoriteRecipes: arrayUnion(recipeId),
        });
      } else {
        console.log('remove');
        await updateDoc(docRef, {
          favoriteRecipes: arrayRemove(recipeId),
        });
      }

      console.log('Favorite recipes updated successfully');

      const additionalAuthData = await this.getAdditionalAuthDataById(userId);

      this.userData$.pipe(take(1)).subscribe((user) => {
        if (user) {
          const castedUser = user as unknown as User;
          this.saveUserData(castedUser, additionalAuthData)
            .then(() => console.log('User data saved successfully'))
            .catch(() => console.error('Failed to save user data'));
        } else {
          console.error('User is null');
        }
      });
    } catch (error) {
      this.globalErrorHandler.handleError(error);
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
    return setDoc(
      doc(this.firestore, this.collectionName, uid),
      additionalAuthData
    );
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
}

/*
User Service Documentation

Overview
The UserService provides functionality for user authentication, including user registration,
 login, logout, password reset, and account deletion. It also manages user data storage in Firestore and local storage.

Properties

- `userData$: Observable<FirestoreUser | null>`: An observable that emits the user data stored locally.

Methods

 registerUser(email: string, password: string, additionalAuthData: FirestoreUser)
- Description: Registers a new user with the provided email, password, and additional authentication data.
- Parameters:
  - email: The email of the user.
  - password: The password of the user.
  - additionalAuthData: Additional user authentication data.
- Returns: void.

 loginUser(email: string, password: string)
- Description: Logs in an existing user with the provided email and password.
- Parameters:
  - email: The email of the user.
  - password: The password of the user.
- Returns: void.

 logoutUser()
- Description: Logs out the current user.
- Returns: void.

 deleteUserAccount()
- Description: Deletes the account of the current user.
- Returns: Promise<void>.

 forgotPassword(passwordResetEmail: string)
- Description: Sends a password reset email to the provided email address.
- Parameters:
  - passwordResetEmail: The email address to send the password reset email to.
- Returns: void.

 updateFavoriteRecipes(recipeId: string, userId: string, add: boolean)
- Description: Updates the list of favorite recipes for the specified user.
- Parameters:
  - recipeId: The ID of the recipe to add or remove from favorites.
  - userId: The ID of the user.
  - add: A boolean indicating whether to add or remove the recipe from favorites.
- Returns: void.

 Private Methods

 sendPasswordResetEmail(passwordResetEmail: string)
- Description: Sends a password reset email using Firebase Authentication.
- Parameters:
  - passwordResetEmail: The email address to send the password reset email to.
- Returns: Promise<void>.

 createUserWithEmailAndPassword(email: string, password: string)
- Description: Creates a new user account using email and password authentication.
- Parameters:
  - email: The email address of the new user.
  - password: The password of the new user.
- Returns: Promise<UserCredential>.

 signInWithEmailAndPassword(email: string, password: string)
- Description: Signs in an existing user with email and password authentication.
- Parameters:
  - email: The email address of the user.
  - password: The password of the user.
- Returns: Promise<UserCredential>.

 signOutAuth()
- Description: Signs out the current user.
- Returns: Promise<void>.

 addAdditionalAuthData(uid: string, additionalAuthData: FirestoreUser)
- Description: Adds additional authentication data to the Firestore document of the specified user.
- Parameters:
  - uid: The ID of the user.
  - additionalAuthData: Additional authentication data to be added.
- Returns: Promise<void>.

 getAdditionalAuthDataById(uid: string)
- Description: Retrieves additional authentication data from Firestore based on the user ID.
- Parameters:
  - uid: The ID of the user.
- Returns: Promise<FirestoreUser | null>.

 saveUserData(user: User, additionalAuthData: FirestoreUser | null)
- Description: Saves user data locally in local storage and emits it through the userData$ observable.
- Parameters:
  - user: The user object obtained from Firebase Authentication.
  - additionalAuthData: Additional authentication data retrieved from Firestore.
- Returns: Promise<void>.

 clearUserData()
- Description: Clears user data stored locally in local storage and emits null through the userData$ observable.
- Returns: Promise<void>.

*/
