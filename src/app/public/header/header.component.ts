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
    // Animation to rotate an element on hover
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
  isDropdownOpen: boolean = false;
  isSearchOpen: boolean = false;

  toggleDropdown(open: boolean): void {
    this.isDropdownOpen = open;
  }
  // State for the animation
  state = 'normal';

  // Form group for search input
  searchForm = this.fb.group({
    search: [''],
  });

  // Flag to track whether the menu is open or closed
  isMenuOpen = false;

  // User data
  userData: FirestoreUser | null | undefined;

  // Subject to hold user data
  private userDataSubject: BehaviorSubject<FirestoreUser | null> =
    new BehaviorSubject<FirestoreUser | null>(null);

  // Subscription to user data changes
  userDataSubscription: Subscription | undefined;

  /**
   * @param userService Service for managing user data
   * @param router Angular router service for navigation
   * @param fb FormBuilder service for creating reactive forms
   * @param elementRef Reference to the host element of the component
   * @param formErrorCheckService Service for handling form errors
   * @param globalErrorHandler Service for handling global errors
   */
  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private elementRef: ElementRef,
    private formErrorCheckService: FormErrorCheckService,
    private globalErrorHandler: GlobalErrorHandlerService
  ) {
    // Subscribe to user data changes
    this.userDataSubscription = this.userDataSubject.subscribe((value) => {
      this.userData = value;
    });
  }

  // Mouse over event handler to trigger animation
  onMouseOver() {
    this.state = 'hovered';
  }

  // Mouse out event handler to trigger animation
  onMouseOut() {
    this.state = 'normal';
  }

  ngOnInit(): void {
    // Subscribe to user data changes from UserService
    this.userService.userData$.subscribe({
      next: (value) => {
        if (value) {
          // If user data is available, update userDataSubject
          this.userDataSubject.next(value);
          console.log('You have a user!', value);
        } else {
          // If user data is null, update userDataSubject with null
          this.userDataSubject.next(null);
          console.log('You have no user!');
        }
      },
      error: (error) => {
        // Handle errors from UserService
        this.globalErrorHandler.handleError(error);
      },
    });

    // Subscribe to router events to close the menu on navigation
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // If navigation is complete, close the menu
        const navbarCollapse =
          this.elementRef.nativeElement.querySelector('#navbarScroll');
        if (navbarCollapse) {
          navbarCollapse.classList.remove('show');
        }
      }
    });
  }

  // Form submission handler for search
  async onSubmit() {
    if (this.searchForm.valid) {
      // If the form is valid, navigate to recipe search page

      let query = this.searchForm.value;
      if (query && query.search) {
        await this.router.navigate(['/recipe-search'], {
          queryParams: { search: query.search.trim() },
        });
        // Reset the form after navigation
        this.searchForm.reset();
      } else {
        // Handle form validation errors
        const errorMessage = 'Query search value is null or undefined.';
        this.globalErrorHandler.handleError(errorMessage);
      }
    } else {
      // Handle form validation errors
      const errorMessage = this.formErrorCheckService.getFormGroupErrors(
        this.searchForm
      );
      this.globalErrorHandler.handleError(errorMessage);
    }
  }

  // Unsubscribe from user data changes to prevent memory leaks
  ngOnDestroy() {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }

  // Logout method
  async logout() {
    await this.userService.logoutUser();
  }

  // Method to get user display name
  getUserDisplayName(): string {
    return this.userData ? this.userData.lastName : 'Anonymous';
  }

  // Toggler for mobile menu bar
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Close mobile menu after click
  closeMenu(): void {
    this.isMenuOpen = false;
  }

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }
}
