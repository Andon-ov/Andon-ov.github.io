import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/shared/interfaces/interfaces';
import { UserService } from 'src/app/shared/services/user.service';
import { Firestore } from '@angular/fire/firestore';

import { RecipesService } from 'src/app/shared/services/recipes.service';

@Component({
  selector: 'app-user-recipes',
  templateUrl: './user-recipes.component.html',
  styleUrls: ['./user-recipes.component.css'],
})
// export class UserRecipesComponent  {
//   userData: any | null = null;
//   recipes: Recipe[] = [];

//   constructor(
//     private userService: UserService,
//     private firestore: Firestore,
//     private recipeService: RecipesService
//   ) {
//     this.userService.userData$.subscribe({
//       next: (value) => {
//         if (value) {
//           this.userData = value;
//           console.log(value.uid);
//         } else {
//           console.log(`Cant found user with this UID ${value!.uid}`);
//         }
//       },
//       error: (err) => {
//         console.log(err);
//       },
//     });

//     this.recipeService
//       .getRecipeByUID(this.userData.uid)
//       .then((data: any) => {
//         console.log(data);
//       })
//       .catch((error: any) => {
//         console.error('Error fetching recipes:', error);
//       });
//   }
// }
export class UserRecipesComponent implements OnInit {
  userData: any | null = null;
  recipes: Recipe[] = [];

  constructor(
    private userService: UserService,
    private firestore: Firestore,
    private recipeService: RecipesService
  ) {}

  ngOnInit(): void {
    this.userService.userData$.subscribe({
      next: (value) => {
        if (value) {
          this.userData = value;
          console.log(value.uid);

          this.loadRecipesByUID(value.uid);
        } else {
          console.log(`Cant found user with this UID ${value!.uid}`);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  async loadRecipesByUID(uid: string): Promise<void> {
    try {
      const recipes = await this.recipeService.getRecipeByUID(uid);
      console.log(recipes);
      this.recipes = recipes;
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  }
}
