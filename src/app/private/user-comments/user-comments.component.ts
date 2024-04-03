import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Comments, FirestoreUser } from 'src/app/public/interfaces/interfaces';
import { CommentService } from 'src/app/public/services/comment/comment.service';
import { GlobalErrorHandlerService } from 'src/app/public/services/globalErrorHandler/global-error-handler.service';
import { UserService } from 'src/app/public/services/user.service';

@Component({
  selector: 'app-user-comments',
  templateUrl: './user-comments.component.html',
  styleUrls: ['./user-comments.component.css'],
})
export class UserCommentsComponent implements OnInit {
  // Array to store user's comments
  comments: Comments[] = [];
  // User data
  userData: FirestoreUser | null | undefined;
  // Flag to indicate if comments are loading
  isLoadingComments: boolean = true;

  /**
   * @param commentService Service for managing comments
   * @param userService Service for managing user data
   * @param router Angular router service
   * @param globalErrorHandler Service for handling global errors
   */
  constructor(
    private commentService: CommentService,
    private userService: UserService,
    private router: Router,
    private globalErrorHandler: GlobalErrorHandlerService
  ) {
    // Subscribe to user data changes
    this.userService.userData$.subscribe((userData) => {
      this.userData = userData;
    });
  }

  ngOnInit(): void {
    // Load user comments on component initialization
    this.loadData()
      .then(() => {})
      .catch((error) => {
        this.globalErrorHandler.handleError(error);
      });
  }

  /**
   * Load user comments from the service
   */
  async loadData() {
    // Check if user data is available
    if (this.userData) {
      try {
        // Fetch comments for the user
        this.comments = await this.commentService.getCommentsForUser(
          this.userData.uid
        );

        // Set loading flag to false once comments are loaded
        this.isLoadingComments = false;
      } catch (error) {
        // Handle error if comments loading fails
        this.globalErrorHandler.handleError(error);
      }
    }
  }

  /**
   * Navigate to the comment edit page
   * @param commentId The ID of the comment to edit
   */
  async navigateToCommentEdit(commentId: string) {
    await this.router.navigate(['/dashboard/comment-edit', commentId]);
  }

  /**
   * Delete a comment
   * @param id The ID of the comment to delete
   */
  async deleteComment(id: string) {
    try {
      // Delete the comment using the service
      await this.commentService.deleteComment(id);
      console.log('Comment deleted successfully.');

      // Reload comments after deletion
      await this.loadData();
    } catch (error) {
      // Handle error if deletion fails
      this.globalErrorHandler.handleError(error);
    }
  }
}
