import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/public/services/user.service';
import { CustomAlertService } from '../custom-alert/custom-alert.service';
import { GlobalErrorHandlerService } from '../services/globalErrorHandler/global-error-handler.service';
import { FormErrorCheckService } from '../services/formErrorCheck/form-error-check.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private formErrorCheckService: FormErrorCheckService,
    private globalErrorHandler: GlobalErrorHandlerService
  ) {
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

  async submitRegisterForm() {
    if (this.registerForm.valid) {
      this.formErrorCheckService.markFormGroupTouched(this.registerForm);
      const { email, password, repeatPassword, ...additionalAuthData } =
        this.registerForm.value;

      if (password !== repeatPassword) {
        const errorMessage = 'Password do not match!';
        this.globalErrorHandler.handleError(errorMessage);
        return;
      }

      try {
        await this.userService.registerUser(
          email,
          password,
          additionalAuthData
        );
      } catch (error) {
        this.globalErrorHandler.handleError(error);
      }
    } else {
      const errorMessage = this.formErrorCheckService.getFormGroupErrors(
        this.registerForm
      );
      this.globalErrorHandler.handleError(errorMessage);
    }
  }
}
