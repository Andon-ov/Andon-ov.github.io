import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormErrorCheckService {
  /**
   * Marks all controls within a form group as touched recursively.
   * @param formGroup The form group to mark as touched
   */
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Marks all controls within form array as touched.
   * @param formArray The form array to mark as touched
   */
  markFormArrayControlsTouched(formArray: FormArray) {
    for (let i = 0; i < formArray.length; i++) {
      const formGroup = formArray.at(i) as FormGroup;
      this.markFormGroupTouched(formGroup);
    }
  }

  /**
   * Retrieves error messages for all controls within a form group.
   * @param formGroup The form group to check for errors
   * @returns A string containing all error messages
   */
  getFormGroupErrors(formGroup: FormGroup): string {
    let errorMessage = '';
    Object.keys(formGroup.controls).forEach((key) => {
      const controlErrors = formGroup.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach((keyError) => {
          errorMessage += `${key} ${this.getControlErrorMessage(
            keyError,
            controlErrors[keyError]
          )}\n`;
        });
      }
    });
    return errorMessage;
  }

  /**
   * Retrieves the error message for a specific control error.
   * @param errorKey The key of the error
   * @param errorValue The value of the error
   * @returns The error message corresponding to the error key and value
   */
  private getControlErrorMessage(errorKey: string, errorValue: any): string {
    switch (errorKey) {
      case 'required':
        return '-> this field is required.';
      case 'minlength':
        return `-> Minimum length is ${errorValue.requiredLength}.`;
      case 'maxlength':
        return `-> Maximum length is ${errorValue.requiredLength}.`;
      default:
        return '';
    }
  }
}
