import { Component, OnInit } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Recipe } from 'src/app/shared/interfaces/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css'],
})
export class RecipeCreateComponent implements OnInit {
  editorConfig = {};

  recipeForm: FormGroup;
  firestore: Firestore;

  currentOrderIndex = 1;

  constructor(
    firestore: Firestore,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.firestore = firestore;

    this.recipeForm = this.fb.group({
      is_active: [false],

      title: ['', [Validators.required]],
      subtitle: ['', [Validators.required]],
      description: ['', [Validators.required]],
      summary: [''],
      like: [0],
      author: [''],

      image_recipe: this.fb.array([]),
      video_recipe: this.fb.array([]),
      preparation_method: this.fb.array([]),

      ingredients: this.fb.array([
        this.fb.group({
          name: ['', [Validators.required]],
          amount: [null, [Validators.required]],
          unit: ['', [Validators.required]],
          order_index: [0],
        }),
      ]),
    });
  }

  ngOnInit(): void {
    this.editorConfig = {
      // skin: 'oxide-dark',
      content_style: 'body { background-color: #f6f4f9; }',
      content_css: 'default',

      base_url: '/tinymce',
      suffix: '.min',
      menubar: false,
      height: 300,
      // plugins: [
      //   'advlist autolink lists link image charmap print preview anchor',
      //   'searchreplace visualblocks code fullscreen',
      //   'insertdatetime media table paste code wordcount ',
      // ],
      toolbar:
        'undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat ',
    };
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

  addPreparation() {
    const preparationArray = this.recipeForm.get(
      'preparation_method'
    ) as FormArray;
    preparationArray.push(
      this.fb.group({
        preparation_method: '',
      })
    );
  }

  removePreparation(index: number) {
    const preparationArray = this.recipeForm.get(
      'preparation_method'
    ) as FormArray;
    preparationArray.removeAt(index);
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
    console.log(this.currentOrderIndex);
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
    if (this.recipeForm.invalid) {
      alert(
        'The form is not valid. Please fill in all required fields.'
      );
      return;
    }

    const recipeData = this.recipeForm.value;
    this.addRecipe(recipeData);
    this.recipeForm.reset();
  }

  addRecipe(recipeData: Recipe) {
    const collectionName = 'Recipe';

    addDoc(collection(this.firestore, collectionName), recipeData)
      .then((docRef) => {
        console.log('Document written with ID: ', docRef.id);
        this.router.navigate(['/recipe', docRef.id]);
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  }
}
