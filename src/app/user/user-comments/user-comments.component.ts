import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Comments } from 'src/app/shared/interfaces/interfaces';
import { CommentService } from 'src/app/shared/services/comment.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user-comments',
  templateUrl: './user-comments.component.html',
  styleUrls: ['./user-comments.component.css'],
})
export class UserCommentsComponent implements OnInit{
  comments: Comments[] = [];
  userData: any;

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
    this.loadData()
  }

  async loadData() {
    if (this.userData) {
      try {
        // this.recipe = await this.recipeService.getRecipeById(this.recipeId);
        this.comments = await this.commentService.getCommentsForUser(
          this.userData.uid
        );
        console.log('Recipe data loaded successfully.');
      } catch (error) {
        console.error('An error occurred while loading recipe data:', error);
      }
    }
  }

  navigateToCommentEdit(commentId: string) {
    this.router.navigate(['/comment-edit', commentId]);
  }

  deleteComment(id: string) {
    this.commentService.deleteComment(id);
    this.loadData()
  }
}
