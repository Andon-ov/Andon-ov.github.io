import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {UserService} from '../../shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  logInForm: FormGroup;
  loginError: string | null = null;
  returnUrl: string | null = null;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.logInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  async submitLogInForm() {
    if (this.logInForm.valid) {
      const {email, password} = this.logInForm.value;

      try {
        await this.userService.loginUser(email, password);

        const targetUrl = this.returnUrl || '/category';

        await this.router.navigateByUrl(targetUrl);
      } catch (error) {
        console.log(error);
      }
    }
  }
}
