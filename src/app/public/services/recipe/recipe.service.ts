import { Injectable } from '@angular/core';
import {
  Firestore,
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  CollectionReference,
  query,
  where,
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
  Query,
  orderBy,
  startAfter,
  limit,
  addDoc,
} from '@angular/fire/firestore';
import { Recipe } from '../../interfaces/interfaces';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { GlobalErrorHandlerService } from '../globalErrorHandler/global-error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private lastDocSubject = new BehaviorSubject<
    QueryDocumentSnapshot<DocumentData> | undefined
  >(undefined);
  public lastDoc$ = this.lastDocSubject.asObservable();
  collectionName = 'Recipe';
  paginateNumber = 12;
  constructor(
    private firestore: Firestore,
    private router: Router,
    private globalErrorHandler: GlobalErrorHandlerService
  ) {}

  async getRecipes(): Promise<{ data: Recipe[] }> {
    try {
      let q: Query<Recipe> = query(
        collection(
          this.firestore,
          this.collectionName
        ) as CollectionReference<Recipe>,
        orderBy('title')
      );

      q = query(q, limit(this.paginateNumber));

      const querySnapshot: QuerySnapshot<Recipe> = await getDocs(q);
      let data: Recipe[] = [];

      querySnapshot.forEach((doc) => {
        const recipeData = doc.data();
        const recipeWithId = { ...recipeData, id: doc.id };
        data.push(recipeWithId);
      });

      const lastDocFromQuery =
        querySnapshot.docs[querySnapshot.docs.length - 1];
      this.lastDocSubject.next(lastDocFromQuery);

      return { data };
    } catch (error) {
      this.globalErrorHandler.handleError(error);
      throw error;
    }
  }

  async getRecipesLoadMore(): Promise<{ data: Recipe[]; hasMore: boolean }> {
    try {
      const lastDoc = await firstValueFrom(this.lastDoc$);

      let q: Query<Recipe> = query(
        collection(
          this.firestore,
          this.collectionName
        ) as CollectionReference<Recipe>,
        orderBy('title')
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      q = query(q, limit(this.paginateNumber));

      const querySnapshot: QuerySnapshot<Recipe> = await getDocs(q);
      let data: Recipe[] = [];

      querySnapshot.forEach((doc) => {
        const recipeData = doc.data();
        const recipeWithId = { ...recipeData, id: doc.id };
        data.push(recipeWithId);
      });

      const hasMore = querySnapshot.size === this.paginateNumber;

      const lastDocFromQuery =
        querySnapshot.docs[querySnapshot.docs.length - 1];
      this.lastDocSubject.next(lastDocFromQuery);

      return { data, hasMore };
    } catch (error) {
      this.globalErrorHandler.handleError(error);
      throw error;
    }
  }

  async getRecipeById(recipeId: string): Promise<Recipe | null> {
    try {
      const recipeDocRef = doc(this.firestore, this.collectionName, recipeId);
      const recipeSnapshot = await getDoc(recipeDocRef);

      if (recipeSnapshot.exists()) {
        let recipe = recipeSnapshot.data() as Recipe;
        if (!recipe.id) {
          recipe = { ...recipe, id: recipeId };
        }
        return recipe;
      } else {
        return null;
      }
    } catch (error) {
      this.globalErrorHandler.handleError(error);
      throw error;
    }
  }

  async getRecipeByUID(uid: string): Promise<Recipe[]> {
    try {
      const recipesRef = collection(this.firestore, this.collectionName);
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
      this.globalErrorHandler.handleError(error);
      throw error;
    }
  }

  async searchRecipesByTitle(titleQuery: string): Promise<{ data: Recipe[] }> {
    try {
      let q: Query<Recipe> = query(
        collection(
          this.firestore,
          this.collectionName
        ) as CollectionReference<Recipe>,
        orderBy('title')
      );

      const querySnapshot: QuerySnapshot<Recipe> = await getDocs(q);
      let data: Recipe[] = [];

      querySnapshot.forEach((doc) => {
        const recipeData = doc.data();
        const recipeWithId = { ...recipeData, id: doc.id };
        data.push(recipeWithId);
      });

      if (titleQuery) {
        data = data.filter((recipe) =>
          recipe.title.toLowerCase().includes(titleQuery.toLowerCase())
        );
      }

      return { data };
    } catch (error) {
      this.globalErrorHandler.handleError(error);
      throw error;
    }
  }

  async updateRecipeLikes(recipeId: string, userId: string, add: boolean) {
    const docRef = doc(this.firestore, this.collectionName, recipeId);

    try {
      if (!add) {
        console.log('add');

        await updateDoc(docRef, {
          likes: arrayUnion(userId),
        });
      } else {
        console.log('remove');
        await updateDoc(docRef, {
          likes: arrayRemove(userId),
        });
      }

      console.log('Recipe likes updated successfully');
    } catch (error) {
      this.globalErrorHandler.handleError(error);
      throw error;
    }
  }

  async deleteRecipe(recipeId: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, this.collectionName, recipeId);
      await deleteDoc(docRef);
      console.log('Recipe deleted successfully:', recipeId);
    } catch (error) {
      this.globalErrorHandler.handleError(error);
      throw error;
    }
  }

  addRecipe(recipeData: Recipe) {
    addDoc(collection(this.firestore, this.collectionName), recipeData)
      .then((docRef) => {
        console.log('Document written with ID: ', docRef.id);
        this.router.navigate(['/recipe', docRef.id]);
      })
      .catch((error) => {
        this.globalErrorHandler.handleError(error);
        throw error;
      });
  }

  updateRecipe(recipeData: Recipe, recipeId: string) {
    if (recipeId) {
      const docRef = doc(this.firestore, this.collectionName, recipeId);
      const dataToUpdate: Record<string, any> = { ...recipeData };
      updateDoc(docRef, dataToUpdate)
        .then(() => {
          console.log('Document successfully updated');
          this.router.navigate(['/recipe', recipeId]);
        })
        .catch((error) => {
          this.globalErrorHandler.handleError(error);
        });
    } else {
      const errorMessage = 'Invalid recipe id.';
      this.globalErrorHandler.handleError(errorMessage);
    }
  }
}

/*
Recipe Service Documentation

Overview
The RecipeService provides methods for interacting with recipe data in the Firestore database. 
It includes functions for retrieving recipes, adding, updating, and deleting recipes,
as well as searching recipes by title and updating recipe likes.

Methods

 getRecipes()
- Description: Retrieves a list of recipes from the Firestore database.
- Returns: Promise<{ data: Recipe[] }>
- Throws: Error if unable to retrieve recipes.

 getRecipesLoadMore()
- Description: Retrieves additional recipes from the Firestore database to load more recipes.
- Returns: Promise<{ data: Recipe[]; hasMore: boolean }>
- Throws: Error if unable to retrieve recipes.

 getRecipeById(recipeId: string)
- Description: Retrieves a single recipe by its ID from the Firestore database.
- Parameters: recipeId - The ID of the recipe to retrieve.
- Returns: Promise<Recipe | null> - The recipe object if found, or null if not found.
- Throws: Error if unable to retrieve the recipe.

 getRecipeByUID(uid: string)
- Description: Retrieves recipes associated with a specific user ID from the Firestore database.
- Parameters: uid - The user ID to filter recipes by.
- Returns: Promise<Recipe[]> - An array of recipe objects associated with the specified user ID.
- Throws: Error if unable to retrieve recipes.

 searchRecipesByTitle(titleQuery: string)
- Description: Searches for recipes by title in the Firestore database.
- Parameters: titleQuery - The search query string.
- Returns: Promise<{ data: Recipe[] }> - An array of recipe objects matching the search query.
- Throws: Error if unable to retrieve recipes.

 updateRecipeLikes(recipeId: string, userId: string, add: boolean)
- Description: Updates the likes for a specific recipe in the Firestore database.
- Parameters: recipeId - The ID of the recipe to update likes for.
              userId - The ID of the user whose like is being added or removed.
              add - A boolean value indicating whether to add or remove the like.
- Throws: Error if unable to update recipe likes.

 deleteRecipe(recipeId: string)
- Description: Deletes a recipe from the Firestore database.
- Parameters: recipeId - The ID of the recipe to delete.
- Returns: Promise<void>
- Throws: Error if unable to delete the recipe.

 addRecipe(recipeData: Recipe)
- Description: Adds a new recipe to the Firestore database.
- Parameters: recipeData - The data of the recipe to add.
- Throws: Error if unable to add the recipe.

 updateRecipe(recipeData: Recipe, recipeId: string)
- Description: Updates an existing recipe in the Firestore database.
- Parameters: recipeData - The updated data of the recipe.
              recipeId - The ID of the recipe to update.
- Throws: Error if unable to update the recipe.

*/
