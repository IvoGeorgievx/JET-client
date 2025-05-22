import {
  Component,
  inject,
  OnInit,
  Signal,
  WritableSignal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryStore } from '@core/store/category.store';
import { Category } from '@shared/types/category.type';
import { checkInvalidFields } from '@shared/utils/form-utils';

interface ICategoryForm {
  name: FormControl<string>;
  type: FormControl<string>;
}

@Component({
  selector: 'jet-categories',
  imports: [ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  categoryStore = inject(CategoryStore);
  categories: Signal<Category[]>;
  categoryForm: FormGroup<ICategoryForm>;

  constructor() {
    this.categories = this.categoryStore.categories;
  }

  ngOnInit(): void {
    this.initForm();
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
    });
  }

  createCategory() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const payload = this.categoryForm.getRawValue();

    this.categoryStore.createCategory(payload);

    this.categoryForm.reset();
  }

  deleteCategory(id: string) {
    if (!id) return;

    this.categoryStore.deleteCategory(id);
  }

  checkInvalidField(field: string) {
    return checkInvalidFields(this.categoryForm, field);
  }
}
