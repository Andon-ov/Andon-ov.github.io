import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Comments, FirestoreUser } from 'src/app/public/interfaces/interfaces';
import { CommentService } from 'src/app/public/services/comment/comment.service';
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
    private router: Router
  ) {
    this.userService.userData$.subscribe((userData) => {
      this.userData = userData;
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    if (this.userData) {
      try {
        this.comments = await this.commentService.getCommentsForUser(
          this.userData.uid
        );
        console.log('Comments loaded successfully.');
        this.isLoadingComments = false;
        console.log(this.comments);

        console.log(this.isLoadingComments);
      } catch (error) {
        console.error('An error occurred while loading Comments data:', error);
      }
    }
  }

  navigateToCommentEdit(commentId: string) {
    this.router.navigate(['/dashboard/comment-edit', commentId]);
  }

  async deleteComment(id: string) {
    try {
      await this.commentService.deleteComment(id);
      console.log('Comment deleted successfully.');
      this.loadData();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }
}
