import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeDeleteComponent } from './recipe-delete.component';

describe('RecipeDeleteComponent', () => {
  let component: RecipeDeleteComponent;
  let fixture: ComponentFixture<RecipeDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeDeleteComponent]
    });
    fixture = TestBed.createComponent(RecipeDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
