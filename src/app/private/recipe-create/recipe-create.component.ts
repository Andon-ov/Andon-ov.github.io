import { Component, OnInit } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { FirestoreUser, Recipe } from 'src/app/public/interfaces/interfaces';
import { Router } from '@angular/router';
import { UserService } from 'src/app/public/services/user.service';
import { FormErrorCheckService } from 'src/app/public/services/formErrorCheck/form-error-check.service';
import {CustomAlertService} from "../../public/custom-alert/custom-alert.service";

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css'],
})
export class RecipeCreateComponent implements OnInit {
  fullName = '';
  recipeForm: FormGroup;
  firestore: Firestore;
  userData: FirestoreUser | null | undefined;
  currentOrderIndex = 1;

  constructor(
    firestore: Firestore,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private formErrorCheckService: FormErrorCheckService,
    private modalService: CustomAlertService
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
          console.log(`Cant found user with this UID`);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  ngOnInit(): void {}

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
    // this.formErrorCheckService.markFormGroupTouched(this.recipeForm);
    // this.formErrorCheckService.markFormArrayControlsTouched(this.ingredients);

    // if (this.recipeForm.invalid) {
    //   alert('The form is not valid. Please fill in all required fields.');
    //   return;
    // }

    if (this.recipeForm.invalid) {
      this.modalService.sendModalMessage("error");
      console.log('1');

      return;
    }

    console.log(this.image_recipe);

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
