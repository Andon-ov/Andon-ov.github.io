# Project Documentation

## Overview

This Angular project "The Natural Way" is a recipe management application designed to enable users to efficiently manage recipes. Users can view, search, add, edit, and delete recipes, as well as like and comment on them. Additionally, users can register, log in, and manage their accounts, including adding recipes, viewing their recipe collection, updating their favorite recipes, viewing their comments, and deleting their accounts. The project utilizes Firebase Authentication for user authentication and Firebase Firestore Cloud for data storage.

## Features

- **User Authentication:** Users can register, login, logout, and reset their passwords.
- **Recipe Management:** Users can create, edit, delete, like, comment and search for recipes.
- **User Comments:** Users can add, edit, and delete comments on recipes.
- **User Profile Management:** Users can view and delete their profiles, including managing their favorite recipes, recipes added by the user, and their comments.

## Project Architecture

The project follows a modular architecture with separate modules for different features:

- **app.component.\*:** Root component files.
- **app.module.ts:** Main module file where components, directives, and services are declared.
- **app-routing.module.ts:** Defines the routing configuration for navigating between different components.

### Private Module

The private module is accessible only to authenticated users and is utilized by lazy loading. It contains:

- **comment-form-edit:** Component for editing comments.
- **dashboard:** Component responsible for user navigation.
- **image-upload:** Component for uploading images by Cloudinary.
- **private.guard.ts:** Guard for restricting access to unauthorized users.
- **private.module.ts:** Module for private components and features.
- **private-routing.module.ts:** Routing configuration for private module.
- **recipe-create:** Component for creating recipes.
- **recipe-delete:** Component for deleting recipes.
- **recipe-edit:** Component for editing recipes.
- **user-comments:** Component for managing user comments.
- **user-favorite-recipes:** Component for managing favorite recipes.
- **user-info:** Component for viewing user information.
- **user-recipes:** Component for displaying user-specific recipes.

### Public Module

The public module is accessible to both authorized and unauthorized users, responsible for managing the main part of the application. It contains:

- **carousel:** Component for displaying a slideshow of images.
- **comment-form:** Component for adding comments to recipes.
- **custom-alert:** Component for displaying custom alert messages or notifications.
- **footer:** Component for displaying footer content such as project information and link.
    - **about-us:** Component for displaying information about the application.
    - **contact-us:** Component for providing contact information.
    - **privacy-policy:** Component for displaying the privacy policy of the application.
- **forgot-password:** Component for handling the process of resetting a user's password.
- **header:** Component for displaying the header of the application containing navigation links and branding.
- **interfaces:** Contains TypeScript interfaces used for defining data structures.
- **login:** Component for handling user login functionality.
- **logo-svg:** Component for displaying a logo in SVG format.
- **page-not-found:** Component for displaying a 404 error page when a requested page is not found.
- **pipes:** Contains custom Angular pipes for data transformation and formatting.
    - **safeUrl:** Custom Angular pipe for sanitizing and displaying safe URLs.
    - **timestampFormat:** Custom Angular pipe for formatting timestamps into a human-readable date format.
- **public.guard.ts:** This guard prevents logged-in users from accessing routes like login and register until they log out.
- **public.module.ts:** Module for public components and features accessible to all users.
- **recipe:** Component for displaying individual recipes.
- **recipe-search:** Component for searching for recipes based on title.
- **recipes-list:** Component for displaying a list of recipes. It initially displays 12 recipes and provides a "Load More" button to fetch and display additional recipes in batches of 12 upon clicking.
- **register:** Component for handling user registration functionality.
- **scroll-to-top:** Component for enabling users to scroll to the top of the page. Additionally, it provides functionality to go back to the previous page.
- **services:** Contains Angular services responsible for various functionalities in the application.
    - **comment:** Angular service for managing comments, such as adding, editing, and deleting comments.
    - **formErrorCheck:** Angular service for validating and handling form errors.
    - **globalErrorHandler:** Angular service for handling global errors and exceptions in the application.
    - **recipe:** Angular service for managing recipes, including CRUD operations.
    - **searchData:** Angular service for handling search functionality, such as searching for recipes.
    - **user.service.ts:** Angular service for managing user-related functionalities, such as authentication, registration, and profile management.

## Technologies Used

- **Angular:** Frontend framework for building single-page applications.
- **Firebase:** Provides backend services, including Authentication and Firestore for data storage.
- **Cloudinary:** Cloud-based image and video management platform.
- **Font Awesome:** Icon toolkit for web development.
- **Bootstrap:** Frontend component library for building responsive web applications.
- **RxJS:** Reactive Extensions library for asynchronous programming.
- **HTML/CSS/SCSS:** Markup and styling languages for creating user interfaces.

## Installation and Setup

To run the project locally, follow these steps:

1. Clone the project repository from GitHub.
2. Install Node.js and npm if not already installed.
3. Run `npm install` to install project dependencies.
4. Configure Firebase project and obtain API keys.
5. Update Firebase configuration in the project.
6. Run `ng serve` to start the development server.
7. Access the application in your web browser at `http://localhost:4200`.

## Online Access

The project can be accessed online at: [https://andon-ov.github.io/](https://andon-ov.github.io/)  
Demo Account:

- Email: test@yahoo.com
- Password: 123456

## Achievement

The project was ranked in the top 3 of the course "Angular - February 2024 at SoftUni", in which 493 projects participated.