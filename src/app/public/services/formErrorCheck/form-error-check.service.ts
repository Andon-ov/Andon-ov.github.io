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
    Object.keys(formGroup.controls).forEach(key => {
      const controlErrors = formGroup.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          errorMessage += `${key} ${this.getControlErrorMessage(keyError, controlErrors[keyError])}\n`;
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
