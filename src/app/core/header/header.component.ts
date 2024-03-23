import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { RecipesService } from 'src/app/shared/services/recipes.service';
import { SearchDataService } from 'src/app/shared/services/search-data.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  searchForm: any;

  isMenuOpen = false;
  userData: any | null = null;
  private userDataSubject: BehaviorSubject<any | null> = new BehaviorSubject<
    any | null
  >(null);
  private userDataSubscription: Subscription;

  constructor(
    private userService: UserService,
    private recipesService: RecipesService,
    private router: Router,
    private fb: FormBuilder,
    private searchDataService: SearchDataService
  ) {
    this.userDataSubscription = this.userDataSubject.subscribe((value) => {
      this.userData = value;
      console.log(this.userData);
    });

    this.searchForm = this.fb.group({
      search: [''],
    });
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
  }

  onSubmit() {
    if (this.searchForm.valid) {
      let query = this.searchForm.value;
      this.searchDataService.searchQuery = query.search.trim();
      this.searchForm.reset()
      this.router.navigate(['/recipe-search']);
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.userService.logoutUser();
  }

  getUserDisplayName(): string {
    return this.userData ? this.userData.lastName : 'Anonymous';
  }
}
