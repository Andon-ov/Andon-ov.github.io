import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomAlertService } from './custom-alert.service';

@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.css'],
})
export class CustomAlertComponent implements OnInit, OnDestroy {
  // Flag to control whether to show the modal or not
  showModal: boolean = false;
  // Variable to hold the message to be displayed in the modal
  modalMessage: string | undefined;
  // Subscription to the modal message observable
  private modalMessageSubscription: Subscription | undefined;

  constructor(private modalService: CustomAlertService) {}

  ngOnInit(): void {
    // Subscribe to the modal message observable when the component initializes
    this.modalMessageSubscription = this.modalService.modalMessage$.subscribe(
      // When a new message is received, update the modalMessage and show the modal
      (message) => {
        console.log(3);
        this.modalMessage = message;
        console.log(message);
        this.showModal = true;
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from the modal message observable when the component is destroyed
    if (this.modalMessageSubscription) {
      this.modalMessageSubscription.unsubscribe();
    }
  }

  // Function to hide the modal when the user clicks on the close button
  hideModal() {
    this.showModal = false;
  }
}
