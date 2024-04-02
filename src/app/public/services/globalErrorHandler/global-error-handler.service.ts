import { Injectable, ErrorHandler } from '@angular/core';
import {CustomAlertService} from "../../custom-alert/custom-alert.service";

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {
    constructor(private alertService: CustomAlertService) {
    }

  handleError(error: Error | unknown): void {
    if (error instanceof Error) {
      const errorCode = (error as Error).name;
      const errorMessage = (error as Error).message;
      console.error(`Error (${errorCode}): ${errorMessage}`);
      this.alertService.sendModalMessage(
        `Error (${errorCode}): \n
         ${errorMessage}`
      );
    } else {
      this.alertService.sendModalMessage(`Unknown error occurred:
      \n${error}`);
    }
  }


}
