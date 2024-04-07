import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreUser } from 'src/app/public/interfaces/interfaces';
import { FormErrorCheckService } from 'src/app/public/services/formErrorCheck/form-error-check.service';
import { GlobalErrorHandlerService } from 'src/app/public/services/globalErrorHandler/global-error-handler.service';
import { UserService } from 'src/app/public/services/user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
})
export class UserInfoComponent implements OnInit {
  // User data
  user: FirestoreUser | null | undefined;
  // The form group for editing auth info
  authFormEdit!: FormGroup;
  // Flag to toggle display of authFormEdit form
  showAuthFormEdit = false;


  /**
   * @param userService Service for interacting with user data
   * @param fb FormBuilder service for creating reactive forms
   * @param formErrorCheckService Service for handling form errors
   * @param globalErrorHandler Service for handling global errors
   */
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private formErrorCheckService: FormErrorCheckService,
    private globalErrorHandler: GlobalErrorHandlerService
  ) {}

  ngOnInit(): void {
    // Subscribe to user data changes
    this.userService.userData$.subscribe((userData) => {
      this.user = userData;
    });
    this.initializeForm();
  }

  /**
   * Initializes the form using FormBuilder service.
   * Defines form controls for comment editing.
   */
  private initializeForm() {
    this.authFormEdit = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
    });
  }

  /**
   * Populates the form with comment data retrieved from Firestore.
   */
  patchFormWithCommentData() {
    this.authFormEdit.patchValue({
      firstName: this.user?.firstName,
      lastName: this.user?.lastName,
    });
  }

  /**
   * Handles form submission.
   * Marks the form as touched, checks for form validity, and either submits the edited auth data or displays form errors.
   */
  onSubmit() {
    this.formErrorCheckService.markFormGroupTouched(this.authFormEdit);
    if (this.authFormEdit.valid && this.user?.uid) {
      this.authFormEdit.patchValue({
        favoriteRecipes: this.user?.favoriteRecipes,
      });
      this.authFormEdit.patchValue({ isActive: this.user?.isActive });
      this.authFormEdit.patchValue({ isAdmin: this.user?.isAdmin });

      const additionalAuthData = this.authFormEdit.value;

      try {
        this.userService.updateAdditionalAuthData(
          additionalAuthData,
          this.user.uid
        );
        this.authFormEdit.reset();
        this.showAuthFormEdit = false;
      } catch (error) {
        this.globalErrorHandler.handleError(error);
      }
    } else {
      const errorMessage = this.formErrorCheckService.getFormGroupErrors(
        this.authFormEdit
      );
      this.globalErrorHandler.handleError(errorMessage);
    }
  }

  /**
   * Toggles the visibility of the comment form.
   */
  toggleAuthFormEdit() {
    this.showAuthFormEdit = !this.showAuthFormEdit;
  }

  /**
   * Delete user account.
   * Prompts the user for confirmation before proceeding with account deletion.
   */
  async deleteUser() {
    // Confirm if the user wants to delete the account
    const isConfirmed = window.confirm(
      'Are you sure you want to delete your account?'
    );
    // If user confirms, delete the account
    if (isConfirmed) {
      await this.userService.deleteUserAccount();
    }
  }
}
