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

import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from 'src/app/shared/services/recipe.service';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Comments, Recipe } from '../../shared/interfaces/interfaces';
import { UserService } from 'src/app/shared/services/user.service';
import { CommentService } from 'src/app/shared/services/comment.service';

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
  userData: any;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private commentService: CommentService,
    private userService: UserService,
    private firestore: Firestore,
    private router: Router
  ) {
    this.route.paramMap.subscribe(async (params) => {
      const recipeId = params.get('id');
      this.recipeId = recipeId;

      if (recipeId) {
        try {
          this.recipe = await this.recipeService.getRecipeById(recipeId);

          this.comments = await commentService.getCommentsForRecipe(recipeId);
        } catch (error) {
          console.error(
            'An error occurred while retrieving the recipe:',
            error
          );
        }
      } else {
        console.error('Recipe ID not provided.');
      }
    });

    commentService.getCommentAddedObservable().subscribe(() => {
      console.log('Comment successfully added.');
      this.loadCommentsForRecipe();
    });
  }

  navigateToRecipeEdit() {
    this.router.navigate(['/dashboard/recipe-edit', this.recipeId]);
  }

  ngOnInit(): void {
    this.userService.userData$.subscribe((userData) => {
      this.userData = userData;
    });
  }
  toggleCommentForm() {
    this.showCommentForm = !this.showCommentForm;
  }

  private async loadCommentsForRecipe() {
    if (this.recipeId) {
      this.comments = await this.commentService.getCommentsForRecipe(
        this.recipeId
      );
    }
  }
}
