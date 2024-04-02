import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CustomAlertService {
  private modalMessageSource = new Subject<string>();
  modalMessage$ = this.modalMessageSource.asObservable();

  constructor() {}

  sendModalMessage(message: string) {
    this.modalMessageSource.next(message);
  }
}
