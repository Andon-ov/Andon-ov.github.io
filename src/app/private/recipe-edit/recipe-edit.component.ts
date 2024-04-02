import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
  ImageRecipeItem,
  Ingredient,
  PreparationMethodItem,
  Recipe,
  VideoRecipeItem,
} from '../../public/interfaces/interfaces';
import {Firestore} from '@angular/fire/firestore';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RecipeService} from 'src/app/public/services/recipe/recipe.service';
import {FormErrorCheckService} from 'src/app/public/services/formErrorCheck/form-error-check.service';
import {GlobalErrorHandlerService} from 'src/app/public/services/globalErrorHandler/global-error-handler.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  recipe: Recipe | null = null;
  recipeId: string | null = '';
  recipeEdit!: FormGroup;
  firestore: Firestore;

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

  private initializeForm() {
    this.recipeEdit = this.fb.group({
      is_active: [false],

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

        is_active: this.recipe.is_active,
        subtitle: this.recipe.subtitle,
        likes: this.recipe.likes,
        author: this.recipe.author,
        uid: this.recipe.uid,
      });
    }
  }

  // start here
  async ngOnInit() {
    this.initializeForm();
    await this.loadData();
  }

  // image
  addImageToForm(imageUrl: string) {
    const imageArray = this.recipeEdit.get('image_recipe') as FormArray;
    imageArray.push(
      this.fb.group({
        image_recipe: imageUrl,
      })
    );
  }

  removeImage(index: number) {
    const imageArray = this.recipeEdit.get('image_recipe') as FormArray;
    imageArray.removeAt(index);
  }

  // video
  addVideo() {
    const videoArray = this.recipeEdit.get('video_recipe') as FormArray;

    videoArray.push(
      this.fb.group({
        video_recipe: '',
      })
    );
  }

  removeVideo(index: number) {
    const videoArray = this.recipeEdit.get('video_recipe') as FormArray;
    videoArray.removeAt(index);
  }


  // ingredient
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

  removeIngredient(index: number) {
    const ingredients = this.recipeEdit.get('ingredients') as FormArray;
    ingredients.removeAt(index);
  }

  get ingredients() {
    return this.recipeEdit.get('ingredients') as FormArray;
  }

  get image_recipe() {
    return this.recipeEdit.get('image_recipe') as FormArray;
  }

  get video_recipe() {
    return this.recipeEdit.get('video_recipe') as FormArray;
  }

  get preparation_method() {
    return this.recipeEdit.get('preparation_method') as FormArray;
  }

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
    if (this.recipeId){
      this.recipeService.updateRecipe(recipeData,this.recipeId)
    }
  }
}
