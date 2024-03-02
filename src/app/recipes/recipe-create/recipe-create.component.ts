import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Recipe } from 'src/app/shared/interfaces/interfaces';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css'],
})
export class RecipeCreateComponent implements OnInit {
  editorConfig = {};

  recipeForm: FormGroup;
  firestore: Firestore;

  constructor(private fb: FormBuilder, firestore: Firestore) {
    this.firestore = firestore;
    this.recipeForm = this.fb.group({
      title: ['', [Validators.required]],
      subtitle: [''],

      description: ['', [Validators.required]],
      is_active: [false],
      image: [''],
    });
  }
  ngOnInit(): void {
    this.editorConfig = {
      // skin: 'oxide-dark',
      content_style:
        'body { background-color: #f6f4f9; }',
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

  onSubmit() {
    if (this.recipeForm.valid) {
      const recipeData = this.recipeForm.value;
      this.addRecipe(recipeData);
      this.recipeForm.reset();
    } else {
      alert('form is invalid');
    }
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

  addRecipe(recipeData: Recipe) {
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
