import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormErrorCheckService {
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  markFormArrayControlsTouched(formArray: FormArray) {
    for (let i = 0; i < formArray.length; i++) {
      const formGroup = formArray.at(i) as FormGroup;
      this.markFormGroupTouched(formGroup);
    }
  }

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

/*
Form Error Check Service Documentation

Overview
The FormErrorCheckService provides methods for handling form errors in Angular applications.
 It includes functions for marking form controls as touched, retrieving error messages for form controls,
  and marking form array controls as touched.

Methods

 markFormGroupTouched(formGroup: FormGroup)
- Description: Marks all controls within a FormGroup as touched.
- Parameters:
    - formGroup: The FormGroup to mark as touched.

 markFormArrayControlsTouched(formArray: FormArray)
- Description: Marks all controls within each FormGroup in a FormArray as touched.
- Parameters:
    - formArray: The FormArray containing FormGroup instances.

 getFormGroupErrors(formGroup: FormGroup)
- Description: Retrieves error messages for all controls within a FormGroup.
- Parameters:
    - formGroup: The FormGroup to retrieve errors for.
- Returns: string - A concatenated string of error messages for the FormGroup controls.


Private Methods

 getControlErrorMessage(errorKey: string, errorValue: any)
- Description: Returns a formatted error message based on the error key and value.
- Parameters:
    - errorKey: The key of the error.
    - errorValue: The value of the error.
- Returns: string - The formatted error message.

Error Messages
The following error messages are supported:
- 'required': Indicates that the field is required.
- 'minlength': Indicates the minimum length required for the field.
- 'maxlength': Indicates the maximum length allowed for the field.


*/
