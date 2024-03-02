import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
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
}
