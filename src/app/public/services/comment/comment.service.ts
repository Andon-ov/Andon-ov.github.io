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
export class CommentService {
  private commentAddedSubject = new Subject<void>();
  collectionName = 'Comments';

  constructor(
    private firestore: Firestore,
    private globalErrorHandler: GlobalErrorHandlerService
  ) {}

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

  async getCommentsForRecipe(recipeId: string): Promise<Comments[]> {
    return this.getCommentsByQuery('recipeId', recipeId);
  }

  async getCommentsForUser(uid: string): Promise<Comments[]> {
    return this.getCommentsByQuery('uid', uid);
  }

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

  getCommentAddedObservable() {
    return this.commentAddedSubject.asObservable();
  }
}


/*
Comment Service Documentation

Overview
The CommentService provides methods for interacting with comment data in the Firestore database.
 It includes functions for retrieving comments, adding, updating, and deleting comments,
  as well as getting comments by specific queries.

Methods

 getCommentsByQuery(queryField: string, queryValue: string)
- Description: Retrieves comments from the Firestore database based on a specified query field and value.
- Parameters: 
    - queryField: The field to query comments by (e.g., 'recipeId', 'uid').
    - queryValue: The value to match the query field.
- Returns: Promise<Comments[]> - An array of comment objects matching the specified query.
- Throws: Error if unable to retrieve comments.

 getCommentsForRecipe(recipeId: string)
- Description: Retrieves comments associated with a specific recipe ID from the Firestore database.
- Parameters: recipeId - The ID of the recipe to retrieve comments for.
- Returns: Promise<Comments[]> - An array of comment objects associated with the specified recipe ID.
- Throws: Error if unable to retrieve comments.

 getCommentsForUser(uid: string)
- Description: Retrieves comments associated with a specific user ID from the Firestore database.
- Parameters: uid - The ID of the user to retrieve comments for.
- Returns: Promise<Comments[]> - An array of comment objects associated with the specified user ID.
- Throws: Error if unable to retrieve comments.

 addComment(commentData: Comments)
- Description: Adds a new comment to the Firestore database.
- Parameters: commentData - The data of the comment to add.
- Returns: Promise<string | null> - The ID of the newly added comment, or null if unsuccessful.
- Throws: Error if unable to add the comment.

 deleteComment(commentId: string)
- Description: Deletes a comment from the Firestore database.
- Parameters: commentId - The ID of the comment to delete.
- Returns: Promise<void>
- Throws: Error if unable to delete the comment.

 getCommentById(commentId: string)
- Description: Retrieves a single comment by its ID from the Firestore database.
- Parameters: commentId - The ID of the comment to retrieve.
- Returns: Promise<Comments | null> - The comment object if found, or null if not found.
- Throws: Error if unable to retrieve the comment.

 editComment(commentData: Comments, commentId: string)
- Description: Updates an existing comment in the Firestore database.
- Parameters: 
    - commentData: The updated data of the comment.
    - commentId: The ID of the comment to update.
- Throws: Error if unable to update the comment.

 getCommentAddedObservable()
- Description: Returns an observable that emits a void value whenever a new comment is added.
- Returns: Observable<void>

*/ 