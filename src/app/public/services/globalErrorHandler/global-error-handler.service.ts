import { Injectable, ErrorHandler } from '@angular/core';
import { CustomAlertService } from '../../custom-alert/custom-alert.service';

@Injectable({
  providedIn: 'root',
})

/**
 * GlobalErrorHandlerService handles errors that occur throughout the application.
 * It implements the ErrorHandler interface to catch and handle errors globally.
 */
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private alertService: CustomAlertService) {}

  /**
   * Handles errors that occur in the application.
   * @param error The error to handle
   */
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
