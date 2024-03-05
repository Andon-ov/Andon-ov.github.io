export interface Recipe {
  id: string;
  is_active: boolean;

  summary: string;
  like: number,
  author: string,
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


/*
created at
edit at
like
comment

image can be a array of images
  and max size 500kb when upload to cloud

video link

fork description to

  Necessary products
    like a ingredients

  Method of preparation


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
