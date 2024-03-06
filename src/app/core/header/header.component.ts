import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  userData: any | null = null;
  private userDataSubject: BehaviorSubject<any | null> = new BehaviorSubject<
    any | null
  >(null);
  private userDataSubscription: Subscription;

  constructor(private userService: UserService) {
    this.userDataSubscription = this.userDataSubject.subscribe((value) => {
      this.userData = value;
      console.log(this.userData);
      
    });
  }

  ngOnInit(): void {
    this.userService.userData$.subscribe({
      next: (value) => {
        if (value) {
          this.userDataSubject.next(value);
          console.log('Имате потребител:', value);
        } else {
          this.userDataSubject.next(null);
          console.log('Нямате потребител.');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
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
