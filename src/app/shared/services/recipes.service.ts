import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import {
  Firestore,
  collection,
  getDocs,
  CollectionReference,
  query,
  where,
  DocumentData,
} from '@angular/fire/firestore';
import { Recipe } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  constructor(private firestore: Firestore) {}

  getRecipes(): Observable<Recipe[]> {
    const collectionName = 'Recipe';
    const collectionRef: CollectionReference = collection(
      this.firestore,
      collectionName
    );

    return new Observable((observer) => {
      getDocs(collectionRef)
        .then((querySnapshot) => {
          const data: Recipe[] = [];

          querySnapshot.forEach((doc) => {
            const recipeData = doc.data() as Recipe;
            const recipeWithId = { ...recipeData, id: doc.id };

            data.push(recipeWithId);
          });
          observer.next(data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  async getRecipeByUID(uid: string): Promise<any[]> {
    try {
      const recipesRef = collection(this.firestore, 'Recipe');
      const q = query(recipesRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);

      const recipes: Recipe[] = [];
      querySnapshot.forEach((doc) => {
        const recipeData = doc.data() as Recipe;
        const recipeWithId = { ...recipeData, id: doc.id };

        recipes.push(recipeWithId);
      });

      return recipes;
    } catch (error) {
      console.error('Error retrieving recipes:', error);
      return [];
    }
  }
}
