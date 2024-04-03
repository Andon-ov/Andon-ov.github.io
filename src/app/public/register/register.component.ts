import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/public/services/user.service';
import { GlobalErrorHandlerService } from '../services/globalErrorHandler/global-error-handler.service';
import { FormErrorCheckService } from '../services/formErrorCheck/form-error-check.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  // Form group for user registration
  registerForm: FormGroup;

  /**
   * @param userService Service for user-related functionalities
   * @param fb FormBuilder service for creating reactive forms
   * @param formErrorCheckService Service for handling form errors
   * @param globalErrorHandler Service for handling global errors
   */
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private formErrorCheckService: FormErrorCheckService,
    private globalErrorHandler: GlobalErrorHandlerService
  ) {
    // Initialize the registration form with form controls and validators
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', Validators.required],

      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      isActive: [true, Validators.required],
      isAdmin: [false, Validators.required],
      favoriteRecipes: this.fb.array([]),
    });
  }

  /**
   * Submits the user registration form.
   * Validates the form, checks if passwords match, and registers the user.
   * Handles errors using the global error handler service.
   */
  async submitRegisterForm() {
    if (this.registerForm.valid) {
      // Mark the form controls as touched
      this.formErrorCheckService.markFormGroupTouched(this.registerForm);

      // Destructure form values
      const { email, password, repeatPassword, ...additionalAuthData } =
        this.registerForm.value;

      // Check if passwords match
      if (password !== repeatPassword) {
        const errorMessage = 'Password do not match!';
        this.globalErrorHandler.handleError(errorMessage);
        return;
      }

      try {
        // Register the user with the provided credentials and additional data
        await this.userService.registerUser(
          email,
          password,
          additionalAuthData
        );
      } catch (error) {
        // Handle registration errors
        this.globalErrorHandler.handleError(error);
      }
    } else {
      // If the form is invalid, get error messages and handle them using the global error handler service
      const errorMessage = this.formErrorCheckService.getFormGroupErrors(
        this.registerForm
      );
      this.globalErrorHandler.handleError(errorMessage);
    }
  }
}
