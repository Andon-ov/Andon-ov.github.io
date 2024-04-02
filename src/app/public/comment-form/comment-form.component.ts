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
  commentForm!: FormGroup;
  firestore: Firestore;
  timestamp = new Date();
  fullName = '';
  userData: FirestoreUser | null | undefined;

  @Input() recipeId!: string | null;

  constructor(
    private fb: FormBuilder,
    firestore: Firestore,
    private commentService: CommentService,
    private userService: UserService,
    private globalErrorHandler: GlobalErrorHandlerService
  ) {
    this.firestore = firestore;
  }

  ngOnInit() {
    this.commentForm = this.fb.group({
      name: [''],
      comment: ['',[ Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      recipeId: [this.recipeId],
      create_time: [this.timestamp],
      uid: [''],
    });

    this.userService.userData$.subscribe({
      next: (value) => {
        if (value) {
          this.userData = value;
          this.fullName =
            this.userData.firstName + ' ' + this.userData.lastName;
        } else {
          this.fullName = 'Anonymous';
        }
      },
      error: (error) => {
        this.globalErrorHandler.handleError(error);
      },
    });
  }

  async onSubmit() {
    this.timestamp = new Date();

    if (this.commentForm.valid) {
      this.commentForm.patchValue({ name: this.fullName });
      this.commentForm.patchValue({ recipeId: this.recipeId });
      this.commentForm.patchValue({ create_time: this.timestamp });
      if (this.userData) {
        this.commentForm.patchValue({ uid: this.userData.uid });
      }

      try {
        const result = await this.commentService.addComment(
          this.commentForm.value
        );
        if (result) {
          this.commentForm.reset();
        } else {
          const errorMessage = 'Error adding comment.';
          this.globalErrorHandler.handleError(errorMessage);
        }
      } catch (error) {
        this.globalErrorHandler.handleError(error);
      }
    }
  }
}
