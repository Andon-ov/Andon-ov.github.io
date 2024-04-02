import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Comments } from 'src/app/public/interfaces/interfaces';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { CommentService } from 'src/app/public/services/comment/comment.service';
import { FormErrorCheckService } from 'src/app/public/services/formErrorCheck/form-error-check.service';
import { GlobalErrorHandlerService } from 'src/app/public/services/globalErrorHandler/global-error-handler.service';

@Component({
  selector: 'app-comment-form-edit',
  templateUrl: './comment-form-edit.component.html',
  styleUrls: ['./comment-form-edit.component.css'],
})
export class CommentFormEditComponent implements OnInit {
  comment: Comments | null = null;
  commentId = '';
  commentFormEdit!: FormGroup;
  firestore: Firestore;

  constructor(
    private route: ActivatedRoute,
    private commentService: CommentService,
    private fb: FormBuilder,
    private router: Router,
    private formErrorCheckService: FormErrorCheckService,
    private globalErrorHandler: GlobalErrorHandlerService,
    firestore: Firestore
  ) {
    this.firestore = firestore;
  }

  async ngOnInit() {
    this.initializeForm();
    await this.loadData();
  }

  private async loadData() {
    this.route.paramMap.subscribe(async (params) => {
      const commentId = params.get('id');
      this.commentId = commentId!;
      if (commentId) {
        try {
          this.comment = await this.commentService.getCommentById(commentId);

          this.patchFormWithCommentData();
        } catch (error) {
          this.globalErrorHandler.handleError(error);
          throw error;
        }
      } else {
        const errorMessage = 'Comment ID not provided.';
        this.globalErrorHandler.handleError(errorMessage);
      }
    });
  }

  private initializeForm() {
    this.commentFormEdit = this.fb.group({
      name: [''],
      comment: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
      recipeId: [''],
      create_time: [''],
      uid: [''],
    });
  }

  patchFormWithCommentData() {
    this.commentFormEdit.patchValue({
      name: this.comment?.name,
      comment: this.comment?.comment,
      recipeId: this.comment?.recipeId,
      create_time: this.comment?.create_time,
      uid: this.comment?.uid,
      id: this.comment?.id,
    });
  }

  async onSubmit() {
    this.formErrorCheckService.markFormGroupTouched(this.commentFormEdit);
    if (this.commentFormEdit.valid) {
      const commentData = this.commentFormEdit.value;

      try {
        await this.editComment(commentData as Comments);
        this.commentFormEdit.reset();
      } catch (error) {
        this.globalErrorHandler.handleError(error);
      }
    } else {
      const errorMessage = this.formErrorCheckService.getFormGroupErrors(
        this.commentFormEdit
      );
      this.globalErrorHandler.handleError(errorMessage);
    }
  }

  async editComment(commentData: Comments) {
    await this.commentService.editComment(commentData, this.commentId);
    await this.router.navigate(['/recipe', this.comment?.recipeId]);
  }
}
