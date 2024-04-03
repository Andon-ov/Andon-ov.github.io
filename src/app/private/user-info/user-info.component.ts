import { Component, OnInit } from '@angular/core';
import { FirestoreUser } from 'src/app/public/interfaces/interfaces';
import { UserService } from 'src/app/public/services/user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
})
export class UserInfoComponent implements OnInit {
  // User data
  user: FirestoreUser | null | undefined;

  /**
   * @param userService Service for interacting with user data
   */
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Subscribe to user data changes
    this.userService.userData$.subscribe((userData) => {
      this.user = userData;
    });
  }

  /**
   * Delete user account.
   * Prompts the user for confirmation before proceeding with account deletion.
   */
  async deleteUser() {
    // Confirm if the user wants to delete the account
    const isConfirmed = window.confirm(
      'Are you sure you want to delete your account?'
    );
    // If user confirms, delete the account
    if (isConfirmed) {
      await this.userService.deleteUserAccount();
    }
  }
}
