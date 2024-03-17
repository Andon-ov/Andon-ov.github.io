import { Injectable } from '@angular/core';
import { Firestore, arrayUnion, doc, getDoc, updateDoc } from '@angular/fire/firestore';
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

  // async updateRecipeLikes(recipeId: string, userId: string) {
  //   const collectionName = 'Recipe';
  //   const docRef = doc(this.firestore, collectionName, recipeId);


  //   await updateDoc(docRef, {
      
  //       "like":userId
  //   });
  // }

  async updateRecipeLikes(recipeId: string, userId: string) {
    const collectionName = 'Recipe';
    const docRef = doc(this.firestore, collectionName, recipeId);

    // Добавете нов лайк към масива
    await updateDoc(docRef, {
      like: arrayUnion(userId)
    });
  }
}
