import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {UserService} from '../services/user.service';
import {FormErrorCheckService} from '../services/formErrorCheck/form-error-check.service';
import {GlobalErrorHandlerService} from '../services/globalErrorHandler/global-error-handler.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  logInForm: FormGroup;
  loginError: string | null = null;
  returnUrl: string | null = null;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private formErrorCheckService: FormErrorCheckService,
    private globalErrorHandler: GlobalErrorHandlerService
  ) {
    this.logInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/login';
  }

  async submitLogInForm() {
    this.formErrorCheckService.markFormGroupTouched(this.logInForm);
    if (this.logInForm.valid) {
      const { email, password } = this.logInForm.value;

      try {
        await this.userService.loginUser(email, password);

        const targetUrl = this.returnUrl || '/';

        await this.router.navigateByUrl(targetUrl);
      } catch (error) {
        this.globalErrorHandler.handleError(error);
      }
    } else {
      const errorMessage = this.formErrorCheckService.getFormGroupErrors(
        this.logInForm
      );
      this.globalErrorHandler.handleError(errorMessage);
    }
  }
}
