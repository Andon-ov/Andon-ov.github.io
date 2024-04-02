import {Component} from '@angular/core';

import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Firestore} from '@angular/fire/firestore';
import {FirestoreUser} from 'src/app/public/interfaces/interfaces';
import {UserService} from 'src/app/public/services/user.service';
import {FormErrorCheckService} from 'src/app/public/services/formErrorCheck/form-error-check.service';
import {GlobalErrorHandlerService} from 'src/app/public/services/globalErrorHandler/global-error-handler.service';
import {RecipeService} from "../../public/services/recipe/recipe.service";

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css'],
})
export class RecipeCreateComponent {
  fullName = '';
  recipeForm: FormGroup;
  firestore: Firestore;
  userData: FirestoreUser | null | undefined;
  currentOrderIndex = 1;

  constructor(
    firestore: Firestore,
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private userService: UserService,
    private formErrorCheckService: FormErrorCheckService,
    private globalErrorHandler: GlobalErrorHandlerService,
  ) {
    this.firestore = firestore;

    this.recipeForm = this.fb.group({
      is_active: [false],
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

    this.userService.userData$.subscribe({
      next: (value) => {
        if (value) {
          this.userData = value;
        } else {
          const errorMessage = `Cant found user with this UID`;
          this.globalErrorHandler.handleError(errorMessage);
        }
      },
      error: (error) => {
        this.globalErrorHandler.handleError(error);
      },
    });
  }

  addImageToForm(imageUrl: string) {
    const imageArray = this.recipeForm.get('image_recipe') as FormArray;
    imageArray.push(
      this.fb.group({
        image_recipe: imageUrl,
      })
    );
  }

  removeImage(index: number) {
    const imageArray = this.recipeForm.get('image_recipe') as FormArray;
    imageArray.removeAt(index);
  }

  addVideo() {
    const videoArray = this.recipeForm.get('video_recipe') as FormArray;
    videoArray.push(
      this.fb.group({
        video_recipe: '',
      })
    );
  }

  removeVideo(index: number) {
    const videoArray = this.recipeForm.get('video_recipe') as FormArray;
    videoArray.removeAt(index);
  }

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

  removeIngredient(index: number) {
    const ingredients = this.recipeForm.get('ingredients') as FormArray;
    ingredients.removeAt(index);
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get image_recipe() {
    return this.recipeForm.get('image_recipe') as FormArray;
  }

  get video_recipe() {
    return this.recipeForm.get('video_recipe') as FormArray;
  }

  get preparation_method() {
    return this.recipeForm.get('preparation_method') as FormArray;
  }

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
