import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';


@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})


export class RecipeCreateComponent {

  editorConfig = {
    base_url: '/tinymce',
    suffix: '.min',
    plugins: 'lists link image table wordcount'
};
  
  recipeForm:FormGroup;
  firestore: Firestore;

  constructor(
    private fb: FormBuilder,
    firestore: Firestore,
  ) {
    this.firestore = firestore;
    this.recipeForm = this.fb.group({
      name: ['', [Validators.required]],
      is_active: [false],
      note: [''],
      image: [''],
    });
  }

  onSubmit(){
    const recipeData = this.recipeForm.value;
    this.addRecipe(recipeData);
    this.recipeForm.reset();
  }



  removeImage() {
    const imageControl = this.recipeForm.get('image');
    imageControl?.setValue('');
  }

  addImageToForm(imageUrl: string) {
    const imageControl = this.recipeForm.get('image');
    imageControl?.setValue(imageUrl);
  }

  get image() {
    return this.recipeForm.get('image');
  }



  addRecipe(recipeData: any) {
    const collectionName = 'Recipe';

    addDoc(collection(this.firestore, collectionName), recipeData)
      .then((docRef) => {
        console.log('Document written with ID: ', docRef.id);
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  }


}
