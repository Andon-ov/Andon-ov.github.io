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

/**
 * The RecipeService provides methods for interacting with recipe data in the Firestore database.
 * It includes functions for retrieving recipes, adding, updating, and deleting recipes,
 * as well as getting recipes by specific queries.
 */
export class RecipeService {
  /**
   * BehaviorSubject holding the last document snapshot in the pagination query result.
   * Used for loading more recipes.
   */
  private lastDocSubject = new BehaviorSubject<
    QueryDocumentSnapshot<DocumentData> | undefined
  >(undefined);
  // Observable representing the last document snapshot in the pagination query result.
  public lastDoc$ = this.lastDocSubject.asObservable();
  // The name of the Firestore collection where recipe documents are stored.
  collectionName = 'Recipe';
  // The number of recipes to paginate in a single query.
  paginateNumber = 12;

  /**
   * Creates an instance of RecipeService.
   * @param firestore The Angular Firestore service for interacting with Firestore database.
   * @param router The Angular Router service for navigation.
   * @param globalErrorHandler The custom global error handler service.
   */
  constructor(
    private firestore: Firestore,
    private router: Router,
    private globalErrorHandler: GlobalErrorHandlerService
  ) {}

  /**
   * Retrieves recipes from the Firestore database.
   * @returns A promise that resolves to an object containing the retrieved recipes.
   */
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

  /**
   * Retrieves additional recipes from the Firestore database for pagination.
   * @returns A promise that resolves to an object containing the retrieved recipes and a flag indicating if there are more recipes to load.
   */
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

  /**
   * Retrieves a recipe by its ID from the Firestore database.
   * @param recipeId The ID of the recipe to retrieve.
   * @returns A promise that resolves to the retrieved recipe or null if not found.
   */
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

  /**
   * Retrieves recipes by the user ID from the Firestore database.
   * @param uid The ID of the user whose recipes to retrieve.
   * @returns A promise that resolves to an array of retrieved recipes.
   */
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

  /**
   * Searches for recipes by title in the Firestore database.
   * @param titleQuery The query string to search for in recipe titles.
   * @returns A promise that resolves to an object containing the retrieved recipes.
   */
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

  /**
   * Updates the likes of a recipe in the Firestore database.
   * @param recipeId The ID of the recipe to update.
   * @param userId The ID of the user who liked or unliked the recipe.
   * @param add A boolean flag indicating whether to add or remove the like.
   */
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

  /**
   * Deletes a recipe from the Firestore database.
   * @param recipeId The ID of the recipe to delete.
   */
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

  /**
   * Adds a new recipe to the Firestore database.
   * @param recipeData The data of the recipe to add.
   */
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

  /**
   * Updates an existing recipe in the Firestore database.
   * @param recipeData The updated data of the recipe.
   * @param recipeId The ID of the recipe to update.
   */
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
