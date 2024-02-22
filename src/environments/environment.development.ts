import { initializeApp } from 'firebase/app';

export const environment = {
  firebaseConfig: {
    apiKey: 'AIzaSyCVbXDjBGUwaOrn1CZYGIwce1dYPKpR7PA',
    authDomain: 'the-natural-way.firebaseapp.com',
    projectId: 'the-natural-way',
    storageBucket: 'the-natural-way.appspot.com',
    messagingSenderId: '778711637280',
    appId: '1:778711637280:web:30b52ea2a4e159578fcb45',
  },

  cloudinaryConfig: {
    cloudName: 'dsla98vyk',
    apiKey: '587566495847865',
    apiSecret: 'sJLzQzouizKo51b9Mv0bI8a5pCI',
    uploadPreset: 'the_natural_way',
  },
};
// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);

