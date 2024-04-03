import { Component, Input, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore } from '@angular/fire/firestore';
import { UserService } from 'src/app/public/services/user.service';
import { CommentService } from 'src/app/public/services/comment/comment.service';
import { FirestoreUser } from '../interfaces/interfaces';
import { GlobalErrorHandlerService } from '../services/globalErrorHandler/global-error-handler.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css'],
})
export class CommentFormComponent implements OnInit {
  // Form group for comment input fields
  commentForm!: FormGroup;
  // Firestore instance for database interactions
  firestore: Firestore;
  // Current timestamp
  timestamp = new Date();
  // Full name of the user
  fullName = '';
  // User data retrieved from UserService
  userData: FirestoreUser | null | undefined;

  // Input property for passing the recipe ID to the component
  @Input() recipeId!: string | null;

  /**
   * @param fb FormBuilder service for creating reactive forms
   * @param commentService Service for interacting with comments in Firestore
   * @param userService Service for user-related functionality
   * @param globalErrorHandler Service for handling global errors
   * @param firestore Firestore service for database interactions
   */
  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private userService: UserService,
    private globalErrorHandler: GlobalErrorHandlerService,
    firestore: Firestore
  ) {
    this.firestore = firestore;
  }

  ngOnInit() {
    // Initialize the comment form and subscribe to user data changes
    this.commentForm = this.fb.group({
      name: [''],
      comment: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
      recipeId: [this.recipeId],
      create_time: [this.timestamp],
      uid: [''],
    });

    // Subscribe to changes in user data
    this.userService.userData$.subscribe({
      next: (value) => {
        if (value) {
          this.userData = value;
          // If user data is available, set the full name
          this.fullName =
            this.userData.firstName + ' ' + this.userData.lastName;
        } else {
          // If user data is not available, set the full name to 'Anonymous'
          this.fullName = 'Anonymous';
        }
      },
      error: (error) => {
        // Handle errors related to user data subscription
        this.globalErrorHandler.handleError(error);
      },
    });
  }

  async onSubmit() {
    // Update the timestamp before submitting the comment
    this.timestamp = new Date();

    // Check if the comment form is valid
    if (this.commentForm.valid) {
      this.commentForm.patchValue({ name: this.fullName });
      this.commentForm.patchValue({ recipeId: this.recipeId });
      this.commentForm.patchValue({ create_time: this.timestamp });
      if (this.userData) {
        this.commentForm.patchValue({ uid: this.userData.uid });
      }

      try {
        // Add the comment to Firestore using the CommentService
        const result = await this.commentService.addComment(
          this.commentForm.value
        );
        if (result) {
          // Reset the comment form after successful submission
          this.commentForm.reset();
        } else {
          // Handle errors if the comment couldn't be added
          const errorMessage = 'Error adding comment.';
          this.globalErrorHandler.handleError(errorMessage);
        }
      } catch (error) {
        // Handle errors related to adding the comment
        this.globalErrorHandler.handleError(error);
      }
    }
  }
}
