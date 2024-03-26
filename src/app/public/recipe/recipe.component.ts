import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RecipeService} from 'src/app/public/services/recipe/recipe.service';
import {Comments, FirestoreUser, Recipe} from '../interfaces/interfaces';
import {UserService} from 'src/app/public/services/user.service';
import {CommentService} from 'src/app/public/services/comment/comment.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
})
export class RecipeComponent implements OnInit {
  recipe: Recipe | null = null;
  recipeId: string | null = '';
  comments: Comments[] = [];
  showCommentForm = false;
  userData: FirestoreUser | undefined;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private commentService: CommentService,
    private userService: UserService,
    private router: Router
  ) {
    this.route.paramMap.subscribe(async (params) => {
      this.recipeId = params.get('id');
    });

    commentService.getCommentAddedObservable().subscribe(async () => {
      console.log('Comment successfully added.');
     await this.loadCommentsForRecipe();
    });
  }

  async loadRecipeData() {
    if (this.recipeId) {
      try {
        this.recipe = await this.recipeService.getRecipeById(this.recipeId);
        this.comments = await this.commentService.getCommentsForRecipe(
          this.recipeId
        );
        console.log('Recipe data loaded successfully.');
      } catch (error) {
        console.error('An error occurred while loading recipe data:', error);
      }
    }
  }

  async navigateToRecipeEdit() {
    await this.router.navigate(['/dashboard/recipe-edit', this.recipeId]);
  }

  async navigateToRecipeDelete() {
    await this.router.navigate(['/dashboard/recipe-delete', this.recipeId]);
  }

  async ngOnInit(): Promise<void>  {
   await this.loadRecipeData();
    this.userService.userData$.subscribe((userData) => {
      if (userData) {
        this.userData = userData;
      }
    });
  }

  toggleCommentForm() {
    this.showCommentForm = !this.showCommentForm;
  }

  async navigateToCommentEdit(commentId: string) {
   await this.router.navigate(['/comment-edit', commentId]);
  }

  async deleteComment(id: string) {
   await this.commentService.deleteComment(id);
   await this.loadCommentsForRecipe();
  }

  async updateRecipeLikes() {
    if (!this.recipe) {
      console.error('Recipe data is missing.');
      return;
    }

    if (!this.userData) {
      console.error('User is not logged in.');
      return;
    }

    if (this.userData) {

      let alreadyLiked = this.recipe.likes.includes(this.userData.uid);


      await this.recipeService.updateRecipeLikes(
        this.recipeId!,
        this.userData.uid,
        alreadyLiked
      );
    }


    await this.loadRecipeData();
  }

  async updateFavoriteRecipes() {
    if (!this.recipe) {
      console.error('Recipe data is missing.');
      return;
    }

    // if (!this.userData.uid) {
    //   console.error('User is not logged in.');
    //   return;
    // }
    if (this.userData && this.recipeId){
      let alreadyInFavorite = this.userData.favoriteRecipes.includes(
        this.recipeId
      );

      await this.userService.updateFavoriteRecipes(
        this.recipeId!,
        this.userData.uid,
        alreadyInFavorite
      );

      await this.loadRecipeData();
    }

  }

  private async loadCommentsForRecipe() {
    if (this.recipeId) {
      this.comments = await this.commentService.getCommentsForRecipe(
        this.recipeId
      );
    }
  }
}



// import { Component } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { Recipe } from 'src/app/shared/interfaces/interfaces';
// import { RecipeService } from 'src/app/shared/services/recipe.service';
// import { DomSanitizer } from '@angular/platform-browser';

// @Component({
//   selector: 'app-recipe',
//   templateUrl: './recipe.component.html',
//   styleUrls: ['./recipe.component.css'],
// })
// export class RecipeComponent {
//   recipe: Recipe | null = null;
//   recipeId: string | null = '';
//   htmlText: string | undefined;

//   constructor(
//     private route: ActivatedRoute,
//     private recipeService: RecipeService,
//     private sanitizer: DomSanitizer
//   ) {
//     this.route.paramMap.subscribe(async (params) => {
//       const recipeId = params.get('id');
//       this.recipeId = recipeId;

//       if (recipeId) {
//         try {
//           this.recipe = await this.recipeService.getRecipeById(recipeId);
//           this.htmlText = this.recipe?.description;
//         } catch (error) {
//           console.error(
//             'An error occurred while retrieving the recipe:',
//             error
//           );
//         }
//       } else {
//         console.error('Recipe ID not provided.');
//       }
//     });
//   }

//   getTrustedHtml() {
//     return this.sanitizer.bypassSecurityTrustHtml(this.htmlText!);
//   }
// }
