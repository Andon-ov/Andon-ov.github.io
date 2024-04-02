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

  constructor(
    private firestore: Firestore,
    private globalErrorHandler: GlobalErrorHandlerService
  ) {}

  async getCommentsByQuery(
    queryField: string,
    queryValue: string
  ): Promise<Comments[]> {
    try {
      const commentsCollectionRef = collection(this.firestore, 'Comments');
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
      const collectionName = 'Comments';
      const docRef = await addDoc(
        collection(this.firestore, collectionName),
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
      const collectionPath = 'Comments';
      const docRef = doc(this.firestore, collectionPath, commentId);
      await deleteDoc(docRef);
      console.log('Comment deleted successfully:', commentId);
    } catch (error) {
      this.globalErrorHandler.handleError(error);
      throw error;
    }
  }

  async getCommentById(commentId: string): Promise<Comments | null> {
    const commentDocRef = doc(this.firestore, 'Comments', commentId);
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
