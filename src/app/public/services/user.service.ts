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
  updateProfile,
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
  deleteDoc,
} from '@angular/fire/firestore';
import { FirestoreUser } from '../interfaces/interfaces';
import { GlobalErrorHandlerService } from './globalErrorHandler/global-error-handler.service';

@Injectable({
  providedIn: 'root',
})

/**
 * The UserService provides methods for user authentication and user data management.
 * It includes functions for registering, logging in, and logging out users,
 * as well as managing user data and account settings.
 */
export class UserService {
  /**
   * BehaviorSubject holding the current user data or null if no user is authenticated.
   */
  private userDataSubject: BehaviorSubject<FirestoreUser | null> =
    new BehaviorSubject<FirestoreUser | null>(null);
  // Observable representing the current user data or null if no user is authenticated.
  userData$: Observable<FirestoreUser | null> =
    this.userDataSubject.asObservable();
  // The name of the Firestore collection where user authentication data is stored.
  collectionName = 'Auth';

  /**
   * Creates an instance of UserService.
   * @param firestore The Angular Firestore service for interacting with Firestore database.
   * @param router The Angular Router service for navigation.
   * @param globalErrorHandler The custom global error handler service.
   */
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

  /**
   * Registers a new user with the provided email, password, and additional data.
   * @param email The email address of the user.
   * @param password The password for the user account.
   * @param additionalAuthData Additional data to be stored with the user account.
   */
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

  /**
   * Logs in a user with the provided email and password.
   * @param email The email address of the user.
   * @param password The password for the user account.
   */
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

  /**
   * Logs out the currently authenticated user.
   */
  async logoutUser() {
    try {
      await this.signOutAuth();
      await this.clearUserData();
      this.router.navigate(['login']);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Deletes the currently authenticated user's account.
   */
  async deleteUserAccount(): Promise<void> {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        await deleteUser(user);
        await this.deleteAdditionalAuthData(user.uid);
        await this.clearUserData();
        this.router.navigate(['login']);
      } else {
        console.error('No user found to delete.');
      }
    } catch (error) {
      console.error('No user found to delete.', error);
    }
  }

  /**
   * Sends a password reset email to the specified email address.
   * @param passwordResetEmail The email address to send the password reset email to.
   */
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

  /**
   * Updates the favorite recipes of a user.
   * @param recipeId The ID of the recipe to update.
   * @param userId The ID of the user whose favorite recipes to update.
   * @param add A boolean flag indicating whether to add or remove the recipe from favorites.
   */
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

  /**
   * Sends a password reset email to the provided email address.
   * @param passwordResetEmail A string representing the email address to which the password reset email will be sent.
   * @returns A promise that resolves when the password reset email is successfully sent.
   */
  private sendPasswordResetEmail(passwordResetEmail: string): Promise<void> {
    const auth = getAuth();
    return sendPasswordResetEmail(auth, passwordResetEmail);
  }

  /**
   *  Creates a new user account with the provided email address and password.
   * @param email A string representing the email address of the user to be created.
   * @param password A string representing the password of the user to be created.
   * @returns A promise that resolves with a UserCredential object containing user authentication data when the user account is successfully created.
   */
  private createUserWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<UserCredential> {
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password);
  }

  /**
   * Signs in an existing user with the provided email address and password.
   * @param email A string representing the email address of the user to be signed in.
   * @param password A string representing the password of the user to be signed in.
   * @returns A promise that resolves with a UserCredential object containing user authentication data when the user is successfully signed in.
   */
  private signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<UserCredential> {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
  }

  /**
   *Signs out the currently authenticated user.
   * @returns A promise that resolves when the user is successfully signed out.
   */
  private signOutAuth(): Promise<void> {
    const auth = getAuth();
    return signOut(auth);
  }

  /**
   * Updates the user profile information such as display name and photo URL.
   * @param displayName The new display name for the user.
   * @param photoURL The new photo URL for the user.
   */
  updateUserProfile(displayName: string, photoURL: string): void {
    const auth = getAuth();

    // Check if there is a current user authenticated
    if (auth.currentUser) {
      // Update the profile with the provided display name and photo URL
      updateProfile(auth.currentUser, {
        displayName: displayName,
        photoURL: photoURL,
      })
        .then(() => {
          console.log('Profile updated successfully');
        })
        .catch((error) => {
          // Handle and log any errors that occur during the profile update
          console.error('Error updating profile:', error);
        });
    }
  }

  /**
   * Adds additional authentication data to the Firestore document corresponding to the user.
   * @param uid A string representing the unique identifier (UID) of the user.
   * @param additionalAuthData An object containing additional authentication data to be added to the user document.
   * @returns A promise that resolves when the additional authentication data is successfully added to the Firestore document.
   */
  private addAdditionalAuthData(
    uid: string,
    additionalAuthData: FirestoreUser
  ): Promise<void> {
    return setDoc(
      doc(this.firestore, this.collectionName, uid),
      additionalAuthData
    );
  }

  /**
   * Retrieves additional authentication data from the Firestore document corresponding to the specified user ID (UID).
   * @param uid A string representing the unique identifier (UID) of the user.
   * @returns A promise that resolves with the additional authentication data retrieved from the Firestore document, or null if the document does not exist.
   */
  private async getAdditionalAuthDataById(
    uid: string
  ): Promise<FirestoreUser | null> {
    const authDocRef = doc(this.firestore, this.collectionName, uid);
    const authSnapshot = await getDoc(authDocRef);

    if (authSnapshot.exists()) {
      return authSnapshot.data() as FirestoreUser;
    } else {
      return null;
    }
  }

  /**
   * Updates additional authentication data for a user in Firestore.
   * @param additionalAuthData The updated additional authentication data.
   * @param uid The user ID for which the additional authentication data will be updated.
   */
  updateAdditionalAuthData(additionalAuthData: FirestoreUser, uid: string) {
    if (uid) {
      // Get the document reference for the user in the Firestore collection
      const docRef = doc(this.firestore, this.collectionName, uid);

      // Create an object containing data to update
      const dataToUpdate: Record<string, any> = { ...additionalAuthData };

      // Update the document
      updateDoc(docRef, dataToUpdate)
        .then(() => {
          console.log('Document successfully updated');
          this.router.navigate(['/dashboard/user-info']);
        })
        .then(() => {
          // Get the current user data from userData$ observable
          this.userData$.pipe(take(1)).subscribe((user) => {
            if (user) {
              const castedUser = user as unknown as User;
              // Save updated user data
              this.saveUserData(castedUser, additionalAuthData)
                .then(() => console.log('User data saved successfully'))
                .catch(() => console.error('Failed to save user data'));
            } else {
              console.error('User is null');
            }
          });
        })
        .catch((error) => {
          this.globalErrorHandler.handleError(error);
        });
    } else {
      const errorMessage = 'Invalid uid.';
      this.globalErrorHandler.handleError(errorMessage);
    }
  }

  /**
   * Deletes additional authentication data for a user from Firestore.
   *
   * @param uid The user ID for which the additional authentication data will be deleted.
   * @returns A Promise that resolves when the data is deleted successfully or rejects with an error.
   */
  async deleteAdditionalAuthData(uid: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, this.collectionName, uid);
      await deleteDoc(docRef);
      console.log('Recipe deleted successfully:', uid);
    } catch (error) {
      this.globalErrorHandler.handleError(error);
      throw error;
    }
  }

  /**
   * Saves user data (including authentication data and additional auth data) to localStorage and updates the userDataSubject.
   * @param user A User object representing the authenticated user.
   * @param additionalAuthData An object containing additional authentication data associated with the user.
   * @returns A promise that resolves when the user data is successfully saved.
   */
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

  /**
   * Clears user data from localStorage and sets userDataSubject to null.
   * @returns A promise that resolves when the user data is successfully cleared.
   */
  private clearUserData(): Promise<void> {
    return new Promise((resolve, reject) => {
      localStorage.removeItem('user');
      this.userDataSubject.next(null);
      resolve();
    });
  }
}
