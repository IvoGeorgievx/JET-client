import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryStore } from '@core/store/category.store';
import { Category } from '@shared/types/category.type';
import { checkInvalidFields } from '@shared/utils/form-utils';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { ToastInfo } from '@shared/types/toast.type';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';

interface ICategoryForm {
  name: FormControl<string>;
  type: FormControl<string>;
}

@Component({
  selector: 'jet-categories',
  imports: [ReactiveFormsModule, ModalComponent, ToastComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  categoryStore = inject(CategoryStore);
  categories: Signal<Category[]>;
  categoryForm: FormGroup<ICategoryForm>;

  modalOpened = false;
  categoriesOpened = false;

  showToast = false;

  toastInfo = signal<ToastInfo>({
    text: '',
  });

  constructor() {
    this.categories = this.categoryStore.categories;
  }

  ngOnInit(): void {
    this.initForm();
  }

  public handleAccordionState() {
    this.categoriesOpened = !this.categoriesOpened;
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

    this.categoryStore.createCategory(payload).subscribe({
      next: () => {
        this.showToast = true;
        this.modalOpened = false;
        this.toastInfo.set({
          text: 'Category successfully created',
          type: 'success',
        });
      },
      error: () => {
        this.showToast = true;
        this.toastInfo.set({
          text: 'Category creation failed.',
          type: 'error',
        });
      },
    });

    this.categoryForm.reset();
  }

  deleteCategory(id: string) {
    if (!id) return;

    this.categoryStore.deleteCategory(id).subscribe({
      next: () => {
        this.showToast = true;
        this.toastInfo.set({
          text: 'Category successfully deleted.',
          type: 'success',
        });
      },
      error: () => {
        this.showToast = true;
        this.toastInfo.set({
          text: 'Failed to delete category.',
          type: 'error',
        });
      },
    });
  }

  checkInvalidField(field: string) {
    return checkInvalidFields(this.categoryForm, field);
  }

  showModal() {
    this.modalOpened = true;
  }
}
