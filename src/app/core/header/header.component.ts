import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';

import { UserService } from 'src/app/shared/services/user.service';
import { FirestoreUser } from '../../shared/interfaces/interfaces';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchForm = this.fb.group({
    search: [''],
  });

  isMenuOpen = false;
  userData: FirestoreUser | undefined | null;
  private userDataSubject: BehaviorSubject<any | null> = new BehaviorSubject<
    any | null
  >(null);
  private userDataSubscription: Subscription;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private elementRef: ElementRef
  ) {
    this.userDataSubscription = this.userDataSubject.subscribe((value) => {
      this.userData = value;
      console.log(this.userData);
    });

    // this.searchForm = this.fb.group({
    //   search: [''],
    // });
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
      error: (err) => {
        console.log(err);
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

  // async onSubmit() {
  //   if (this.searchForm.valid) {
  //     let query = this.searchForm.value;
  //     await this.router.navigate(['/recipe-search'], {queryParams: {search: query.search.trim()}});
  //     this.searchForm.reset();
  //   } else {
  //     alert('Try again!');
  //   }
  // }

  async onSubmit() {
    if (this.searchForm.valid) {
      let query = this.searchForm.value;
      if (query && query.search) {
        await this.router.navigate(['/recipe-search'], {
          queryParams: { search: query.search.trim() },
        });
        this.searchForm.reset();
      } else {
        console.error('Query search value is null or undefined.');
      }
    } else {
      alert('Try again!');
    }
  }

  ngOnDestroy() {
    this.userDataSubscription.unsubscribe();
  }

  async logout() {
    await this.userService.logoutUser();
  }

  getUserDisplayName(): string {
    return this.userData ? this.userData.lastName : 'Anonymous';
  }
}
