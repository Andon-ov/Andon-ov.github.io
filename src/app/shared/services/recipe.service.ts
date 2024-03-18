import { Injectable } from '@angular/core';
import {
  Firestore,
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Recipe } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  constructor(private firestore: Firestore) {}

  async getRecipeById(recipeId: string): Promise<Recipe | null> {
    const recipeDocRef = doc(this.firestore, 'Recipe', recipeId);
    const recipeSnapshot = await getDoc(recipeDocRef);

    if (recipeSnapshot.exists()) {
      return recipeSnapshot.data() as Recipe;
    } else {
      return null;
    }
  }

  async updateRecipeLikes(recipeId: string, userId: string, add: boolean) {
    const collectionName = 'Recipe';
    const docRef = doc(this.firestore, collectionName, recipeId);

    try {
      if (!add) {
        console.log("add");
        
        await updateDoc(docRef, {
          likes: arrayUnion(userId),
        });
      } else {

        console.log("remove");
        await updateDoc(docRef, {
          likes: arrayRemove(userId),
        });
      }

      console.log('Recipe likes updated successfully');
    } catch (error) {
      console.error('Error updating recipe likes: ', error);
    }
  }


}
