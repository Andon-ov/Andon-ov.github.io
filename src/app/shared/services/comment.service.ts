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
import { Comments } from '../interfaces/interfaces';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private commentAddedSubject = new Subject<void>();

  constructor(private firestore: Firestore) {}

  async getCommentsForRecipe(recipeId: string): Promise<Comments[]> {
    try {
      const commentsRecipesRef = collection(this.firestore, 'Comments');
      const q = query(commentsRecipesRef, where('recipeId', '==', recipeId));
      const querySnapshot = await getDocs(q);

      const comments: Comments[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const commentId = doc.id;

        const comment: any = {
          create_time: data['create_time'],
          name: data['name'],
          recipeId: data['recipeId'],
          text: data['text'],
          uid: data['uid'],
          id: commentId,
        };
        comments.push(comment);
      });
      comments.sort((a, b) => {
        const dateA: any = a.create_time.toDate();
        const dateB: any = b.create_time.toDate();

        return dateB - dateA;
      });

      return comments;
    } catch (error) {
      console.error('Error retrieving comments:', error);
      return [];
    }
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
      console.error('Error adding comment:', error);
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
      console.error('Error deleting comment:', error);
    }
  }

  async getCommentById(commentId: string): Promise<Comments | null> {
    const commentDocRef = doc(this.firestore, 'Comments', commentId);
    const commentSnapshot = await getDoc(commentDocRef);

    if (commentSnapshot.exists()) {
      const commentDataId = commentSnapshot.data()
      console.log(commentDataId['recipeId']);
      
      return commentSnapshot.data() as Comments;
    } else {
      return null;
    }
  }

  async editComment(commentId: string, updatedCommentData: Partial<Comments>): Promise<void> {
    try {
      const collectionPath = 'Comments';
      const docRef = doc(this.firestore, collectionPath, commentId);
      await updateDoc(docRef, updatedCommentData);
      console.log('Comment edited successfully:', commentId);
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  }

  getCommentAddedObservable() {
    return this.commentAddedSubject.asObservable();
  }
}
