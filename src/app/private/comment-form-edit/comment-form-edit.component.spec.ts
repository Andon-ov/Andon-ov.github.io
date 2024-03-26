import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentFormEditComponent } from './comment-form-edit.component';

describe('CommentFormEditComponent', () => {
  let component: CommentFormEditComponent;
  let fixture: ComponentFixture<CommentFormEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommentFormEditComponent]
    });
    fixture = TestBed.createComponent(CommentFormEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
