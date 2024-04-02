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
  comments: Comments[] = [];
  userData: FirestoreUser | null | undefined;

  isLoadingComments: boolean = true;

  constructor(
    private commentService: CommentService,
    private userService: UserService,
    private router: Router,
    private globalErrorHandler: GlobalErrorHandlerService
  ) {
    this.userService.userData$.subscribe((userData) => {
      this.userData = userData;
    });
  }

  ngOnInit(): void {
    this.loadData().then(() => {
    }).catch((error) => {
      this.globalErrorHandler.handleError(error);
    });
  }

  async loadData() {
    if (this.userData) {
      try {
        this.comments = await this.commentService.getCommentsForUser(
          this.userData.uid
        );

        this.isLoadingComments = false;
      } catch (error) {
        this.globalErrorHandler.handleError(error);
      }
    }
  }

 async navigateToCommentEdit(commentId: string) {
  await  this.router.navigate(['/dashboard/comment-edit', commentId]);
  }

  async deleteComment(id: string) {
    try {
      await this.commentService.deleteComment(id);
      console.log('Comment deleted successfully.');
      await this.loadData();
    } catch (error) {
      this.globalErrorHandler.handleError(error);
    }
  }
}
