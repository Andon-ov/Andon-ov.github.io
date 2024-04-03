import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../services/user.service';
import { FormErrorCheckService } from '../services/formErrorCheck/form-error-check.service';
import { GlobalErrorHandlerService } from '../services/globalErrorHandler/global-error-handler.service';

/**
 * LoginComponent handles user login functionality.
 * It provides a form interface for users to input their credentials and log in.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  // FormGroup for the login form
  logInForm: FormGroup;
  // Error message to display in case of login failure
  loginError: string | null = null;
  // URL to redirect to after successful login
  returnUrl: string | null = null;

  /**
   * @param userService Service for user authentication
   * @param fb FormBuilder service for creating reactive forms
   * @param route ActivatedRoute for retrieving route parameters
   * @param router Router service for navigation
   * @param formErrorCheckService Service for handling form errors
   * @param globalErrorHandler Service for handling global errors
   */
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private formErrorCheckService: FormErrorCheckService,
    private globalErrorHandler: GlobalErrorHandlerService
  ) {
    // Initialize the login form with form controls and validators
    this.logInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  /**
   * Lifecycle hook called after component initialization.
   * Retrieves the returnUrl from the query parameters.
   */
  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/login';
  }

  /**
   * Handles form submission for user login.
   * Marks the form as touched, checks for form validity,
   * and attempts to log in the user using provided credentials.
   * Redirects the user to the returnUrl after successful login.
   */
  async submitLogInForm() {
    // Mark the form as touched to trigger form validation
    this.formErrorCheckService.markFormGroupTouched(this.logInForm);
    if (this.logInForm.valid) {
      const { email, password } = this.logInForm.value;

      try {
        // Attempt to login the user using provided email and password
        await this.userService.loginUser(email, password);

        // Redirect the user to the returnUrl after successful login
        const targetUrl = this.returnUrl || '/';

        await this.router.navigateByUrl(targetUrl);
      } catch (error) {
        // Handle login errors using the global error handler service
        this.globalErrorHandler.handleError(error);
      }
    } else {
      // If form is invalid, get the error message and handle it using the global error handler service
      const errorMessage = this.formErrorCheckService.getFormGroupErrors(
        this.logInForm
      );
      this.globalErrorHandler.handleError(errorMessage);
    }
  }
}
