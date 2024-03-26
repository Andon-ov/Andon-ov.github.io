import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/public/services/user.service';

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
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', Validators.required],

      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      isActive: [true, Validators.required],
      isAdmin: [false, Validators.required],
      favoriteRecipes:this.fb.array([])

    });
  }

  async submitRegisterForm() {
    if (this.registerForm.valid) {
      const { email, password, repeatPassword, ...additionalAuthData } =
        this.registerForm.value;

      if (password !== repeatPassword) {
        alert('Password do not match!');
        return;
      }

      try {
        await this.userService.registerUser(
          email,
          password,
          additionalAuthData
        );
      } catch (error) {
        alert(error);
      }
    }
  }
}
