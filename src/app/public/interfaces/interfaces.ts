import { Timestamp } from '@angular/fire/firestore';

export interface Recipe {
  id: string;
  is_active: boolean;
  summary: string;
  likes: string[];
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

export interface RecipeWithId {
  id: string;
  is_active: boolean;
  summary: string;
  likes: string[];
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
  favoriteRecipes: string[];
}

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
  comment: string;
  uid: string;
  id: string;
}
