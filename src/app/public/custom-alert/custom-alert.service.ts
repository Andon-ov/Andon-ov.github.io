import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CustomAlertService {
  // Subject to emit and broadcast modal messages
  private modalMessageSource = new Subject<string>();

  // Observable to which components can subscribe to receive modal messages
  modalMessage$ = this.modalMessageSource.asObservable();

  // Method to send a modal message
  sendModalMessage(message: string) {
    // Pushes a new message to the modalMessageSource subject
    this.modalMessageSource.next(message);
  }
}
