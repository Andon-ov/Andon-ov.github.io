import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentFormEditComponent } from './comment-form-edit/comment-form-edit.component';

@NgModule({
  declarations: [CommentFormComponent, CommentFormEditComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [CommentFormComponent, CommentFormEditComponent],
})
export class CommentModule {}
