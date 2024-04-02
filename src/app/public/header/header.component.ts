import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

import { UserService } from 'src/app/public/services/user.service';
import { FirestoreUser } from '../interfaces/interfaces';
import { FormErrorCheckService } from '../services/formErrorCheck/form-error-check.service';
import { GlobalErrorHandlerService } from '../services/globalErrorHandler/global-error-handler.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('rotate', [
      state(
        'normal',
        style({
          transform: 'rotate(0deg)',
        })
      ),
      state(
        'hovered',
        style({
          transform: 'rotate(180deg)',
        })
      ),
      transition('normal => hovered', animate('0.5s ease-in-out')),
      transition('hovered => normal', animate('0.5s ease-in-out')),
    ]),
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  state = 'normal';

  searchForm = this.fb.group({
    search: [''],
  });

  isMenuOpen = false;

  userData: FirestoreUser | null | undefined;
  private userDataSubject: BehaviorSubject<FirestoreUser | null> =
    new BehaviorSubject<FirestoreUser | null>(null);
   userDataSubscription: Subscription | undefined;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private elementRef: ElementRef,
    private formErrorCheckService: FormErrorCheckService,
    private globalErrorHandler: GlobalErrorHandlerService
  ) {
    this.userDataSubscription = this.userDataSubject.subscribe((value) => {
      this.userData = value;
      console.log(this.userData);
    });
  }

  onMouseOver() {
    this.state = 'hovered';
  }

  onMouseOut() {
    this.state = 'normal';
  }

  ngOnInit(): void {
    this.userService.userData$.subscribe({
      next: (value) => {
        if (value) {
          this.userDataSubject.next(value);
          console.log('You have a user:', value);
        } else {
          this.userDataSubject.next(null);
          console.log('You have no user.');
        }
      },
      error: (error) => {
        this.globalErrorHandler.handleError(error);
      },
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const navbarCollapse =
          this.elementRef.nativeElement.querySelector('#navbarScroll');
        if (navbarCollapse) {
          navbarCollapse.classList.remove('show');
        }
      }
    });
  }

  async onSubmit() {
    if (this.searchForm.valid) {
      let query = this.searchForm.value;
      if (query && query.search) {
        await this.router.navigate(['/recipe-search'], {
          queryParams: { search: query.search.trim() },
        });
        this.searchForm.reset();
      } else {
        const errorMessage = 'Query search value is null or undefined.';
        this.globalErrorHandler.handleError(errorMessage);
      }
    } else {
      const errorMessage = this.formErrorCheckService.getFormGroupErrors(
        this.searchForm
      );
      this.globalErrorHandler.handleError(errorMessage);
    }
  }

  ngOnDestroy() {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }

  async logout() {
    await this.userService.logoutUser();
  }

  getUserDisplayName(): string {
    return this.userData ? this.userData.lastName : 'Anonymous';
  }
}
