import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {
  Firestore,
  collection,
  getDocs,
  CollectionReference,
} from '@angular/fire/firestore';
import { Recipe } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(private firestore: Firestore) {
  }

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
            const recipeWithId = {...recipeData, id: doc.id};

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
}
