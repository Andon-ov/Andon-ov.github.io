import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CommentFormComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [CommentFormComponent],
})
export class CommentModule {}
