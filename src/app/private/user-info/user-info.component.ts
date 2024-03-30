import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/public/services/user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
})
export class UserInfoComponent implements OnInit {
  user: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.userData$.subscribe((userData) => {
      this.user = userData;
    });
  }

  deleteUser() {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete your account?'
    );
    if (isConfirmed) {
      this.userService.deleteUserAccount();
    }
  }
}
