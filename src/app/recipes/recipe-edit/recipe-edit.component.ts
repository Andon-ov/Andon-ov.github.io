import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ImageRecipeItem,
  Ingredient,
  PreparationMethodItem,
  Recipe,
  VideoRecipeItem,
} from '../../shared/interfaces/interfaces';
import { Firestore, updateDoc, doc } from '@angular/fire/firestore';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { RecipeService } from 'src/app/shared/services/recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  recipe: Recipe | null = null;
  recipeId = '';
  recipeEdit!: FormGroup;
  firestore: Firestore;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private recipeService: RecipeService,

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
      like: [0],
      author: [''],
      uid: [''],

      image_recipe: this.fb.array([]),
      video_recipe: this.fb.array([]),
      preparation_method: this.fb.array([]),

      ingredients: this.fb.array([]),
    });
  }

  private async loadData() {
    this.route.paramMap.subscribe(async (params) => {
      const recipeId = params.get('id');
      this.recipeId = recipeId!;

      

      if (recipeId) {
        try {
          this.recipe = await this.recipeService.getRecipeById(recipeId);

          
          this.patchFormWithRecipeData();

        } catch (error) {
          console.error(
            'An error occurred while retrieving the recipe:',
            error
          );
          throw error;
        }
      } else {
        console.error('Recipe ID not provided.');
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
        like: this.recipe.like,
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
  // preparation

  addPreparation() {
    const preparationArray = this.recipeEdit.get(
      'preparation_method'
    ) as FormArray;
    preparationArray.push(
      this.fb.group({
        preparation_method: '',
      })
    );
  }

  removePreparation(index: number) {
    const preparationArray = this.recipeEdit.get(
      'preparation_method'
    ) as FormArray;
    preparationArray.removeAt(index);
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
    if (this.recipeEdit.invalid) {
      alert(
        'The form is not valid. Please fill in all required fields.'
      );
      return;
    }

    const recipeData = this.recipeEdit.value;
    this.addRecipe(recipeData);
    this.recipeEdit.reset();
  }

  addRecipe(recipeData: any) {
    const collectionName = 'Recipe';
    const docRef = doc(this.firestore, collectionName, this.recipeId);
    updateDoc(docRef, recipeData);
    this.router.navigate(['/recipe', this.recipeId]);
  }
}
