import {
  DocumentData,
  DocumentReference,
  Timestamp,
} from '@angular/fire/firestore';

export interface Recipe {
  id: string;
  image: string;
  is_active: boolean;
  description: string;
  title: string;
  subtitle?: string;
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