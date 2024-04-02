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

  constructor(
    private firestore: Firestore,
    private router: Router,
    private globalErrorHandler: GlobalErrorHandlerService
  ) {}

  async getRecipes(): Promise<{ data: Recipe[] }> {
    const collectionName = 'Recipe';
    const paginateNumber = 12;

    let q: Query<Recipe> = query(
      collection(this.firestore, collectionName) as CollectionReference<Recipe>,
      orderBy('title')
    );

    q = query(q, limit(paginateNumber));

    const querySnapshot: QuerySnapshot<Recipe> = await getDocs(q);
    let data: Recipe[] = [];

    querySnapshot.forEach((doc) => {
      const recipeData = doc.data();
      const recipeWithId = { ...recipeData, id: doc.id };
      data.push(recipeWithId);
    });

    const lastDocFromQuery = querySnapshot.docs[querySnapshot.docs.length - 1];
    this.lastDocSubject.next(lastDocFromQuery);

    return { data };
  }

  async getRecipesLoadMore(): Promise<{ data: Recipe[]; hasMore: boolean }> {
    const collectionName = 'Recipe';
    const lastDoc = await firstValueFrom(this.lastDoc$);
    const paginateNumber = 12;

    let q: Query<Recipe> = query(
      collection(this.firestore, collectionName) as CollectionReference<Recipe>,
      orderBy('title')
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    q = query(q, limit(paginateNumber));

    const querySnapshot: QuerySnapshot<Recipe> = await getDocs(q);
    let data: Recipe[] = [];

    querySnapshot.forEach((doc) => {
      const recipeData = doc.data();
      const recipeWithId = { ...recipeData, id: doc.id };
      data.push(recipeWithId);
    });

    const hasMore = querySnapshot.size === paginateNumber;

    const lastDocFromQuery = querySnapshot.docs[querySnapshot.docs.length - 1];
    this.lastDocSubject.next(lastDocFromQuery);

    return { data, hasMore };
  }



  async getRecipeById(recipeId: string): Promise<Recipe | null> {
    const recipeDocRef = doc(this.firestore, 'Recipe', recipeId);
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
  }

  async getRecipeByUID(uid: string): Promise<Recipe[]> {
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

  async searchRecipesByTitle(titleQuery: string): Promise<{ data: Recipe[] }> {
    const collectionName = 'Recipe';

    let q: Query<Recipe> = query(
      collection(this.firestore, collectionName) as CollectionReference<Recipe>,
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
  }

  

  async updateRecipeLikes(recipeId: string, userId: string, add: boolean) {
    const collectionName = 'Recipe';
    const docRef = doc(this.firestore, collectionName, recipeId);

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
      console.error('Error updating recipe likes: ', error);
    }
  }

  async deleteRecipe(recipeId: string): Promise<void> {
    try {
      const collectionPath = 'Recipe';
      const docRef = doc(this.firestore, collectionPath, recipeId);
      await deleteDoc(docRef);
      console.log('Recipe deleted successfully:', recipeId);
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  }

  addRecipe(recipeData: Recipe) {
    const collectionName = 'Recipe';

    addDoc(collection(this.firestore, collectionName), recipeData)
      .then((docRef) => {
        console.log('Document written with ID: ', docRef.id);
        this.router.navigate(['/recipe', docRef.id]);
      })
      .catch((error) => {
        this.globalErrorHandler.handleError(error);
        throw error;
      });
  }

  updateRecipe(recipeData: Recipe, recipeId:string) {
    const collectionName = 'Recipe';
    if (recipeId) {
      const docRef = doc(this.firestore, collectionName, recipeId);
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
