import {Component, Input, OnInit} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Firestore} from '@angular/fire/firestore';
import {UserService} from 'src/app/shared/services/user.service';
import {CommentService} from 'src/app/shared/services/comment.service';
import {FirestoreUser} from "../../shared/interfaces/interfaces";

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
    private userService: UserService
  ) {
    this.firestore = firestore;
  }

  ngOnInit() {
    this.commentForm = this.fb.group({
      name: [''],
      text: ['', Validators.required],
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
      error: (err) => {
        console.log(err);
      },
    });
  }

  async onSubmit() {
    this.timestamp = new Date();

    if (this.commentForm.valid) {
      this.commentForm.patchValue({name: this.fullName});
      this.commentForm.patchValue({recipeId: this.recipeId});
      this.commentForm.patchValue({create_time: this.timestamp});
      if (this.userData) {
        this.commentForm.patchValue({uid: this.userData.uid});
      }

      try {
        const result = await this.commentService.addComment(
          this.commentForm.value
        );
        if (result) {
          alert('You have successfully added your comment');
          this.commentForm.reset();
        } else {
          console.error('Error adding comment.');
        }
      } catch (error) {
        console.error('An error occurred while submitting the comment:', error);
      }
    }
  }
}
