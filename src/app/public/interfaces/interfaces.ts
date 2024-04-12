import { Timestamp } from '@angular/fire/firestore';

/**
 * Represents a recipe item.
 */
export interface Recipe {
  id: string;
  public: boolean;
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

/**
 * Represents an item in the image_recipe array of a recipe.
 */
export interface ImageRecipeItem {
  image_recipe: string;
}

/**
 * Represents an item in the video_recipe array of a recipe.
 */
export interface VideoRecipeItem {
  video_recipe: string;
}

/**
 * Represents an item in the preparation_method array of a recipe.
 */
export interface PreparationMethodItem {
  preparation_method: string;
}

/**
 * Represents an ingredient required for a recipe.
 */
export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  order_index: number;
}

/**
 * Represents a user object stored in Firestore.
 */
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

/**
 * Represents metadata associated with a user.
 */
interface UserMetadata {
  createdAt: string;
  creationTime: string;
  lastLoginAt: string;
  lastSignInTime: string;
}

/**
 * Represents a comment made on a recipe.
 */
export interface Comments {
  create_time: Timestamp;
  name: string;
  recipeId: string;
  comment: string;
  uid: string;
  id: string;
}
