import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ImageRecipeItem,
  Ingredient,
  PreparationMethodItem,
  Recipe,
  VideoRecipeItem,
} from '../../public/interfaces/interfaces';
import { Firestore } from '@angular/fire/firestore';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from 'src/app/public/services/recipe/recipe.service';
import { FormErrorCheckService } from 'src/app/public/services/formErrorCheck/form-error-check.service';
import { GlobalErrorHandlerService } from 'src/app/public/services/globalErrorHandler/global-error-handler.service';

/**
 * Component for editing recipes.
 * This component provides functionality for editing existing recipes.
 */
@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  // Current recipe being edited
  recipe: Recipe | null = null;
  // ID of the recipe being edited
  recipeId: string | null = '';
  // Form group for editing the recipe
  recipeEdit!: FormGroup;
  // Firestore instance
  firestore: Firestore;

  /**
   * Constructor for RecipeEditComponent.
   * @param route Angular ActivatedRoute for retrieving route parameters
   * @param fb FormBuilder service for creating reactive forms
   * @param recipeService Service for interacting with recipes
   * @param formErrorCheckService Service for handling form errors
   * @param globalErrorHandler Service for handling global errors
   * @param firestore Instance of Firestore for database interactions
   */
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private formErrorCheckService: FormErrorCheckService,
    private globalErrorHandler: GlobalErrorHandlerService,
    firestore: Firestore
  ) {
    this.firestore = firestore;
  }

  /**
   * Initializes the recipe edit form.
   */
  private initializeForm() {
    this.recipeEdit = this.fb.group({
      public: [true],

      title: ['', [Validators.required]],
      subtitle: ['', [Validators.required]],
      description: ['', [Validators.required]],
      summary: [''],
      author: [''],
      uid: [''],

      likes: this.fb.array([]),
      image_recipe: this.fb.array([]),
      video_recipe: this.fb.array([]),
      preparation_method: this.fb.array([]),

      ingredients: this.fb.array([]),
    });
  }

  /**
   * Loads data for editing the recipe.
   */
  private async loadData() {
    this.route.paramMap.subscribe(async (params) => {
      this.recipeId = params.get('id');

      if (this.recipeId) {
        try {
          this.recipe = await this.recipeService.getRecipeById(this.recipeId);

          this.patchFormWithRecipeData();
        } catch (error) {
          this.globalErrorHandler.handleError(error);

          throw error;
        }
      } else {
        const errorMessage = 'Recipe ID not provided.';
        this.globalErrorHandler.handleError(errorMessage);
      }
    });
  }

  /**
   * Patches the form with data from the fetched recipe.
   */
  patchFormWithRecipeData() {
    if (this.recipe && this.recipeEdit) {
      const ingredientsFormArray = this.recipeEdit.get(
        'ingredients'
      ) as FormArray;
      const imagesFormArray = this.recipeEdit.get('image_recipe') as FormArray;
      const videosFormArray = this.recipeEdit.get('video_recipe') as FormArray;
      const methodsFormArray = this.recipeEdit.get(
        'preparation_method'
      ) as FormArray;

      ingredientsFormArray.clear();
      imagesFormArray.clear();
      videosFormArray.clear();
      methodsFormArray.clear();

      this.recipe.ingredients.forEach((ingredient: Ingredient) => {
        ingredientsFormArray.push(
          this.fb.group({
            name: [ingredient.name, [Validators.required]],
            amount: [ingredient.amount, [Validators.required]],
            unit: [ingredient.unit, [Validators.required]],
            order_index: [ingredient.order_index],
          })
        );
      });

      if (this.recipe.image_recipe && this.recipe.image_recipe.length > 0) {
        this.recipe.image_recipe.forEach((image: ImageRecipeItem) => {
          imagesFormArray.push(
            this.fb.group({
              image_recipe: [image.image_recipe],
            })
          );
        });
      }

      if (this.recipe.video_recipe && this.recipe.video_recipe.length > 0) {
        this.recipe.video_recipe.forEach((video: VideoRecipeItem) => {
          videosFormArray.push(
            this.fb.group({
              video_recipe: [video.video_recipe],
            })
          );
        });
      }

      if (
        this.recipe.preparation_method &&
        this.recipe.preparation_method.length > 0
      ) {
        this.recipe.preparation_method.forEach(
          (method: PreparationMethodItem) => {
            methodsFormArray.push(
              this.fb.group({
                preparation_method: [method.preparation_method],
              })
            );
          }
        );
      }

      this.recipeEdit.patchValue({
        title: this.recipe.title,
        summary: this.recipe.summary,
        description: this.recipe.description,

        public: this.recipe.public,
        subtitle: this.recipe.subtitle,
        likes: this.recipe.likes,
        author: this.recipe.author,
        uid: this.recipe.uid,
      });
    }
  }

  /**
   * Initializes the recipe edit form and loads data.
   */
  async ngOnInit() {
    this.initializeForm();
    await this.loadData();
  }

  /**
   * Adds image URL to the image recipe form array.
   * @param imageUrl The URL of the image to be added
   */
  addImageToForm(imageUrl: string) {
    const imageArray = this.recipeEdit.get('image_recipe') as FormArray;
    imageArray.push(
      this.fb.group({
        image_recipe: imageUrl,
      })
    );
  }

  /**
   * Removes image from the image recipe form array.
   * @param index Index of the image to be removed
   */
  removeImage(index: number) {
    const imageArray = this.recipeEdit.get('image_recipe') as FormArray;
    imageArray.removeAt(index);
  }

  /**
   * Adds a video to the video recipe form array.
   */
  addVideo() {
    const videoArray = this.recipeEdit.get('video_recipe') as FormArray;

    videoArray.push(
      this.fb.group({
        video_recipe: '',
      })
    );
  }

  /**
   * Removes a video from the video recipe form array.
   * @param index Index of the video to be removed
   */
  removeVideo(index: number) {
    const videoArray = this.recipeEdit.get('video_recipe') as FormArray;
    videoArray.removeAt(index);
  }

  /**
   * Adds a new ingredient to the ingredients form array.
   */
  addIngredient() {
    const ingredients = this.recipeEdit.get('ingredients') as FormArray;

    ingredients.push(
      this.fb.group({
        name: ['', [Validators.required]],
        amount: ['', [Validators.required]],
        unit: ['', [Validators.required]],
        order_index: [0],
      })
    );
  }

  /**
   * Removes an ingredient from the ingredients form array.
   * @param index Index of the ingredient to be removed
   */
  removeIngredient(index: number) {
    const ingredients = this.recipeEdit.get('ingredients') as FormArray;
    ingredients.removeAt(index);
  }

  /**
   * Returns the ingredients form array.
   */
  get ingredients() {
    return this.recipeEdit.get('ingredients') as FormArray;
  }

  /**
   * Returns the image recipe form array.
   */
  get image_recipe() {
    return this.recipeEdit.get('image_recipe') as FormArray;
  }

  /**
   * Returns the video recipe form array.
   */
  get video_recipe() {
    return this.recipeEdit.get('video_recipe') as FormArray;
  }

  /**
   * Handles form submission.
   * Marks the form as touched and checks for validity.
   * Submits the updated recipe data to the recipe service for updating.
   * Resets the recipe edit form after submission.
   */
  onSubmit() {
    this.formErrorCheckService.markFormGroupTouched(this.recipeEdit);
    this.formErrorCheckService.markFormArrayControlsTouched(this.ingredients);

    if (this.recipeEdit.invalid) {
      const errorMessage = this.formErrorCheckService.getFormGroupErrors(
        this.recipeEdit
      );
      this.globalErrorHandler.handleError(errorMessage);

      return;
    }

    const recipeData = this.recipeEdit.value;
    this.updateRecipe(recipeData);
    this.recipeEdit.reset();
  }

  updateRecipe(recipeData: Recipe) {
    if (this.recipeId) {
      this.recipeService.updateRecipe(recipeData, this.recipeId);
    }
  }
}
