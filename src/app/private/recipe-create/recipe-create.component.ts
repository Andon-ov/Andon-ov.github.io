import { Component } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore } from '@angular/fire/firestore';
import { FirestoreUser } from 'src/app/public/interfaces/interfaces';
import { UserService } from 'src/app/public/services/user.service';
import { FormErrorCheckService } from 'src/app/public/services/formErrorCheck/form-error-check.service';
import { GlobalErrorHandlerService } from 'src/app/public/services/globalErrorHandler/global-error-handler.service';
import { RecipeService } from '../../public/services/recipe/recipe.service';

/**
 * Component for creating new recipes.
 * This component provides functionality for creating new recipes.
 */
@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css'],
})
export class RecipeCreateComponent {
  // Full name of the user
  fullName = '';
  // Form group for recipe creation
  recipeForm: FormGroup;
  // Firestore instance
  firestore: Firestore;
  // User data
  userData: FirestoreUser | null | undefined;
  // Current order index for ingredients
  currentOrderIndex = 1;

  /**
   * Constructor for RecipeCreateComponent.
   * @param firestore Instance of Firestore for database interactions
   * @param fb FormBuilder service for creating reactive forms
   * @param recipeService Service for interacting with recipes
   * @param userService Service for interacting with user data
   * @param formErrorCheckService Service for handling form errors
   * @param globalErrorHandler Service for handling global errors
   */
  constructor(
    firestore: Firestore,
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private userService: UserService,
    private formErrorCheckService: FormErrorCheckService,
    private globalErrorHandler: GlobalErrorHandlerService
  ) {
    this.firestore = firestore;

    // Initialize the recipe creation form
    this.recipeForm = this.fb.group({
      public: [true],
      title: ['', [Validators.required]],
      subtitle: ['', [Validators.required]],
      description: ['', [Validators.required]],
      summary: [''],
      author: [''],
      uid: [''],
      image_recipe: this.fb.array([]),
      video_recipe: this.fb.array([]),
      preparation_method: this.fb.array([]),
      likes: this.fb.array([]),
      ingredients: this.fb.array([
        this.fb.group({
          name: ['', [Validators.required]],
          amount: [null, [Validators.required]],
          unit: ['', [Validators.required]],
          order_index: [0],
        }),
      ]),
    });

    // Subscribe to user data changes
    this.userService.userData$.subscribe({
      next: (value) => {
        if (value) {
          this.userData = value;
        } else {
          const errorMessage = `Cant found user with this UID`;
          // this.globalErrorHandler.handleError(errorMessage);
          console.error(errorMessage);
        }
      },
      error: (error) => {
        this.globalErrorHandler.handleError(error);
      },
    });
  }

  /**
   * Adds image URL to the image recipe form array.
   * @param imageUrl The URL of the image to be added
   */
  addImageToForm(imageUrl: string) {
    const imageArray = this.recipeForm.get('image_recipe') as FormArray;
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
    const imageArray = this.recipeForm.get('image_recipe') as FormArray;
    imageArray.removeAt(index);
  }

  /**
   * Adds a video to the video recipe form array.
   */
  addVideo() {
    const videoArray = this.recipeForm.get('video_recipe') as FormArray;
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
    const videoArray = this.recipeForm.get('video_recipe') as FormArray;
    videoArray.removeAt(index);
  }

  /**
   * Adds a new ingredient to the ingredients form array.
   */
  addIngredient() {
    const ingredientsArray = this.recipeForm.get('ingredients') as FormArray;
    ingredientsArray.push(
      this.fb.group({
        name: ['', [Validators.required]],
        amount: [null, [Validators.required]],
        unit: ['', [Validators.required]],
        order_index: this.currentOrderIndex,
      })
    );
    this.currentOrderIndex++;
  }

  /**
   * Returns the ingredients form array.
   */
  removeIngredient(index: number) {
    const ingredients = this.recipeForm.get('ingredients') as FormArray;
    ingredients.removeAt(index);
  }

  /**
   * Returns the ingredients form array.
   */
  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  /**
   * Returns the image recipe form array.
   */
  get image_recipe() {
    return this.recipeForm.get('image_recipe') as FormArray;
  }

  /**
   * Returns the video recipe form array.
   */
  get video_recipe() {
    return this.recipeForm.get('video_recipe') as FormArray;
  }

  /**
   * Handles form submission.
   * Marks the form as touched and checks for validity.
   * Adds default image URL if no images are uploaded.
   * Patches author and UID fields with user data.
   * Submits the recipe data to the recipe service for creation.
   * Resets the recipe form after submission.
   */
  onSubmit() {
    this.formErrorCheckService.markFormGroupTouched(this.recipeForm);
    this.formErrorCheckService.markFormArrayControlsTouched(this.ingredients);

    if (this.recipeForm.invalid) {
      const errorMessage = this.formErrorCheckService.getFormGroupErrors(
        this.recipeForm
      );
      this.globalErrorHandler.handleError(errorMessage);
      return;
    }

    if (this.image_recipe.length === 0) {
      const defaultImageUrl =
        'https://res.cloudinary.com/dsla98vyk/image/upload/v1710856403/no_image_u8yfwc.png';
      this.addImageToForm(defaultImageUrl);
    }

    if (this.userData) {
      this.recipeForm.patchValue({
        author: this.userData.firstName + ' ' + this.userData.lastName,
      });
      this.recipeForm.patchValue({ uid: this.userData.uid });
    }

    const recipeData = this.recipeForm.value;
    this.recipeService.addRecipe(recipeData);
    this.recipeForm.reset();
  }
}
