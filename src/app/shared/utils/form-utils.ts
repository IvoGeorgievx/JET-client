import { AbstractControl } from '@angular/forms';

export function checkInvalidFields(form: AbstractControl, field: string) {
  const control = form.get(field);
  return !!control && control.invalid && control.touched;
}
