import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {CustomAlertService} from "./custom-alert.service";

@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.css'],
})
export class CustomAlertComponent implements OnInit, OnDestroy {
  showModal: boolean = false;
  modalMessage: string | undefined;
  private modalMessageSubscription: Subscription | undefined;

  constructor(private modalService: CustomAlertService) {}

  ngOnInit(): void {
    this.modalMessageSubscription = this.modalService.modalMessage$.subscribe(message => {
      console.log(3)
      this.modalMessage = message;
      console.log(message)
      this.showModal = true; // Показване на модалния прозорец
    });
  }

  ngOnDestroy(): void {
    if (this.modalMessageSubscription) {

      this.modalMessageSubscription.unsubscribe();
    }
  }

  hideModal() {
    this.showModal = false;
  }
}
