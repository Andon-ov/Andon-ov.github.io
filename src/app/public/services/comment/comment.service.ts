import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Comments } from '../../interfaces/interfaces';
import { Subject } from 'rxjs';
import { GlobalErrorHandlerService } from '../globalErrorHandler/global-error-handler.service';

@Injectable({
  providedIn: 'root',
})

/**
 * The CommentService provides methods for interacting with comment data in the Firestore database.
 * It includes functions for retrieving comments, adding, updating, and deleting comments,
 * as well as getting comments by specific queries.
 */
export class CommentService {
  // Subject to notify subscribers when a comment is added
  private commentAddedSubject = new Subject<void>();
  // Firestore collection name
  collectionName = 'Comments';

  /**
   * @param firestore Firestore instance for database interactions
   * @param globalErrorHandler Service to handle global errors
   */
  constructor(
    private firestore: Firestore,
    private globalErrorHandler: GlobalErrorHandlerService
  ) {}

  /**
   * Retrieves comments from the Firestore database based on a specific query field and value.
   * @param queryField The field to query comments by (e.g., 'recipeId', 'uid')
   * @param queryValue The value to search for in the specified field
   * @returns A Promise that resolves to an array of comments matching the query
   */
  async getCommentsByQuery(
    queryField: string,
    queryValue: string
  ): Promise<Comments[]> {
    try {
      const commentsCollectionRef = collection(
        this.firestore,
        this.collectionName
      );
      const q = query(
        commentsCollectionRef,
        where(queryField, '==', queryValue)
      );
      const querySnapshot = await getDocs(q);

      const comments: Comments[] = [];
      querySnapshot.forEach((doc) => {
        const { create_time, name, recipeId, comment, uid } = doc.data();
        const commentId = doc.id;

        const commentObj: Comments = {
          create_time,
          name,
          recipeId,
          comment,
          uid,
          id: commentId,
        };
        comments.push(commentObj);
      });

      comments.sort((a, b) => {
        const dateA: Date = a.create_time.toDate();
        const dateB: Date = b.create_time.toDate();
        return dateB.getTime() - dateA.getTime();
      });

      return comments;
    } catch (error) {
      this.globalErrorHandler.handleError(error);
      return [];
    }
  }

  /**
   * Retrieves comments associated with a specific recipe from the Firestore database.
   * @param recipeId The ID of the recipe to retrieve comments for
   * @returns A Promise that resolves to an array of comments for the specified recipe
   */
  async getCommentsForRecipe(recipeId: string): Promise<Comments[]> {
    return this.getCommentsByQuery('recipeId', recipeId);
  }

  /**
   * Retrieves comments associated with a specific user from the Firestore database.
   * @param uid The ID of the user to retrieve comments for
   * @returns A Promise that resolves to an array of comments for the specified user
   */
  async getCommentsForUser(uid: string): Promise<Comments[]> {
    return this.getCommentsByQuery('uid', uid);
  }

  /**
   * Adds a new comment to the Firestore database.
   * @param commentData The data of the comment to be added
   * @returns A Promise that resolves to the ID of the newly added comment, or null if an error occurs
   */
  async addComment(commentData: Comments): Promise<string | null> {
    try {
      const docRef = await addDoc(
        collection(this.firestore, this.collectionName),
        commentData
      );
      this.commentAddedSubject.next();
      return docRef.id;
    } catch (error) {
      this.globalErrorHandler.handleError(error);
      return null;
    }
  }

  /**
   * Deletes a comment from the Firestore database.
   * @param commentId The ID of the comment to be deleted
   * @returns A Promise that resolves when the comment is successfully deleted
   * @throws Throws an error if deletion fails
   */
  async deleteComment(commentId: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, this.collectionName, commentId);
      await deleteDoc(docRef);
      console.log('Comment deleted successfully:', commentId);
    } catch (error) {
      this.globalErrorHandler.handleError(error);
      throw error;
    }
  }

  /**
   * Retrieves a comment from the Firestore database by its ID.
   * @param commentId The ID of the comment to retrieve
   * @returns A Promise that resolves to the comment data, or null if the comment does not exist
   */
  async getCommentById(commentId: string): Promise<Comments | null> {
    const commentDocRef = doc(this.firestore, this.collectionName, commentId);
    const commentSnapshot = await getDoc(commentDocRef);

    if (commentSnapshot.exists()) {
      const commentDataId = commentSnapshot.data();
      console.log(commentDataId['recipeId']);

      return commentSnapshot.data() as Comments;
    } else {
      return null;
    }
  }

  /**
   * Updates an existing comment in the Firestore database.
   * @param commentData The updated data of the comment
   * @param commentId The ID of the comment to be updated
   * @throws Throws an error if the update fails
   */
  async editComment(commentData: Comments, commentId: string) {
    const collectionName = 'Comments';
    const docRef = doc(this.firestore, collectionName, commentId);
    const dataToUpdate: Record<string, any> = { ...commentData };
    try {
      await updateDoc(docRef, dataToUpdate);
    } catch (error) {
      this.globalErrorHandler.handleError(error);
      throw error;
    }
  }

  /**
   * Returns an observable that emits a value whenever a comment is added.
   * Subscribers can listen to this observable to be notified when a comment is added.
   * @returns An observable of type void
   */
  getCommentAddedObservable() {
    return this.commentAddedSubject.asObservable();
  }
}
