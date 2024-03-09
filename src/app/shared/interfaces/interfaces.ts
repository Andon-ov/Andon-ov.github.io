import { Timestamp } from '@angular/fire/firestore';

export interface Recipe {
  id: string;
  is_active: boolean;

  summary: string;
  like: number;
  uid: string;
  author: string;
  title: string;
  subtitle?: string;
  description: string;

  preparation_method: PreparationMethodItem[];
  image_recipe: ImageRecipeItem[];
  video_recipe: VideoRecipeItem[];
  ingredients: Ingredient[];
}

export interface ImageRecipeItem {
  image_recipe: string;
}

export interface VideoRecipeItem {
  video_recipe: string;
}

export interface PreparationMethodItem {
  preparation_method: string;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  order_index: number;
}

export interface FirestoreUser {
  accessToken: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: UserMetadata;
  phoneNumber: string;
  photoURL: string;
  uid: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isAdmin: boolean;
}

/*
FirestoreUser

photoURL
favorite recipes
*/

interface UserMetadata {
  createdAt: string;
  creationTime: string;
  lastLoginAt: string;
  lastSignInTime: string;
}

export interface Comments {
  create_time: Timestamp;
  name: string;
  recipeId: string;
  // userId:string;
  text: string;
  uid: string;
  id: string;
}

/*
created at
edit at
comment
tag for a disease




*/

/*
user

username / email
password

login wit facebook or google

acc info
edit my acc

forgot password
change password

remove favorite recipe
edit and delete my recipe

comments
  edit / delete comments


favorite recipe
my recipe

*/

/*
search
 can searching in title and ingredient name


 can add drop menu with search when push the button search
*/
