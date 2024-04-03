import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Comments } from 'src/app/public/interfaces/interfaces';
import { Firestore } from '@angular/fire/firestore';
import { CommentService } from 'src/app/public/services/comment/comment.service';
import { FormErrorCheckService } from 'src/app/public/services/formErrorCheck/form-error-check.service';
import { GlobalErrorHandlerService } from 'src/app/public/services/globalErrorHandler/global-error-handler.service';

/**
 * Component for editing comments.
 * This component provides a form interface for editing comments and retrieves comment data from Firestore.
 */
@Component({
  selector: 'app-comment-form-edit',
  templateUrl: './comment-form-edit.component.html',
  styleUrls: ['./comment-form-edit.component.css'],
})
export class CommentFormEditComponent implements OnInit {
  // The comment being edited
  comment: Comments | null = null;
  // The ID of the comment being edited
  commentId = '';
  // The form group for editing comments
  commentFormEdit!: FormGroup;
  // Instance of Firestore for database interactions
  firestore: Firestore;

  /**
   * Constructor for CommentFormEditComponent.
   * @param route Angular ActivatedRoute for retrieving route parameters
   * @param commentService Service for interacting with comments in Firestore
   * @param fb FormBuilder service for creating reactive forms
   * @param router Angular router service for navigation
   * @param formErrorCheckService Service for handling form errors
   * @param globalErrorHandler Service for handling global errors
   * @param firestore Instance of Firestore for database interactions
   */
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

  /**
   * Lifecycle hook called when the component is initialized.
   * Initializes the form and loads comment data.
   */
  async ngOnInit() {
    this.initializeForm();
    await this.loadData();
  }

  /**
   * Loads comment data based on the comment ID retrieved from the route parameters.
   * Populates the form with the retrieved data.
   */
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

  /**
   * Initializes the form using FormBuilder service.
   * Defines form controls for comment editing.
   */
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

  /**
   * Populates the form with comment data retrieved from Firestore.
   */
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

  /**
   * Handles form submission.
   * Marks the form as touched, checks for form validity, and either submits the edited comment data or displays form errors.
   */
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

  /**
   * Submits the edited comment data to the commentService for updating in Firestore.
   * Navigates to the recipe detail page after successful submission.
   * @param commentData The edited comment data
   */
  async editComment(commentData: Comments) {
    await this.commentService.editComment(commentData, this.commentId);
    await this.router.navigate(['/recipe', this.comment?.recipeId]);
  }
}
