import { Component, inject, input, OnInit, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryStore } from '@core/store/category.store';
import { CategoryBudgetPeriod } from '@shared/types/category.type';
import { checkInvalidFields } from '@shared/utils/form-utils';
import { tap } from 'rxjs';

interface ICategoryForm {
  name: FormControl<string>;
  type: FormControl<string>;
  budget: FormControl<number | null>;
  budgetPeriod: FormControl<CategoryBudgetPeriod | null>;
}

@Component({
  selector: 'jet-create-category',
  imports: [ReactiveFormsModule],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css',
})
export class CreateCategoryComponent implements OnInit {
  categoryStore = inject(CategoryStore);

  budgetPeriod = CategoryBudgetPeriod;

  prefix = input.required<string>();
  //prefix is needed cuz the form is used in multiple components with identical identifiers in the DOM which can cause browser issues

  categoryForm: FormGroup<ICategoryForm>;
  categoryCreated = output();

  ngOnInit(): void {
    this.initForm();

    this.categoryForm.get('budget')?.valueChanges.subscribe((value) => {
      const budgetPeriodControl = this.categoryForm.get('budgetPeriod');
      if (value !== null) {
        budgetPeriodControl?.enable();
        budgetPeriodControl?.addValidators(Validators.required);
        budgetPeriodControl?.updateValueAndValidity();
      } else {
        budgetPeriodControl?.disable();
      }
    });
  }

  private initForm(): void {
    this.categoryForm = new FormGroup<ICategoryForm>({
      name: new FormControl<string>('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      type: new FormControl<string>('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      budget: new FormControl<number | null>(null),
      budgetPeriod: new FormControl<CategoryBudgetPeriod | null>({
        value: null,
        disabled: true,
      }),
    });
  }

  createCategory() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const payload = this.categoryForm.getRawValue();

    this.categoryStore.createCategory(payload).subscribe();

    this.categoryForm.reset();

    this.categoryCreated.emit();
  }

  checkInvalidField(field: string) {
    return checkInvalidFields(this.categoryForm, field);
  }

  handleBudgetPeriod(event: Event): void {
    const value = (event.target as HTMLSelectElement)
      .value as CategoryBudgetPeriod;
    this.categoryForm.get('budgetPeriod')?.setValue(value);
  }
}
