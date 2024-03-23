import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import {
  Firestore,
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
} from '@angular/fire/firestore';
import { Recipe } from '../interfaces/interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private lastDocSubject = new BehaviorSubject<
    QueryDocumentSnapshot<DocumentData> | undefined
  >(undefined);
  public lastDoc$ = this.lastDocSubject.asObservable();

  constructor(private firestore: Firestore, private router: Router) {}

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
}

//! get all recipe functionality
// getRecipes(): Observable<Recipe[]> {
//   const collectionName = 'Recipe';
//   const collectionRef: CollectionReference = collection(
//     this.firestore,
//     collectionName
//   );

//   return new Observable((observer) => {
//     getDocs(collectionRef)
//       .then((querySnapshot) => {
//         const data: Recipe[] = [];

//         querySnapshot.forEach((doc) => {
//           const recipeData = doc.data() as Recipe;
//           const recipeWithId = { ...recipeData, id: doc.id };

//           data.push(recipeWithId);
//         });
//         observer.next(data);
//         observer.complete();
//       })
//       .catch((error) => {
//         observer.error(error);
//       });
//   });
// }
