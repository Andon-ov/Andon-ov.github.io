import {Component, OnInit} from '@angular/core';
import {FirestoreUser} from 'src/app/public/interfaces/interfaces';
import {UserService} from 'src/app/public/services/user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
})
export class UserInfoComponent implements OnInit {
  user: FirestoreUser | null | undefined;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.userData$.subscribe((userData) => {
      this.user = userData;
    });
  }

async  deleteUser() {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete your account?'
    );
    if (isConfirmed) {
    await  this.userService.deleteUserAccount();
    }
  }
}
