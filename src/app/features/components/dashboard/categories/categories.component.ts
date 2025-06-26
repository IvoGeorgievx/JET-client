import { Component, computed, inject, signal, Signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CategoryStore } from '@core/store/category.store';
import { Category } from '@shared/types/category.type';
import { ToastInfo } from '@shared/types/toast.type';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import { CreateCategoryComponent } from './create-category/create-category.component';

interface ICategoryForm {
  name: FormControl<string>;
  type: FormControl<string>;
  budget: FormControl<number | null>;
}

@Component({
  selector: 'jet-categories',
  imports: [
    ReactiveFormsModule,
    ModalComponent,
    ToastComponent,
    CreateCategoryComponent,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  categoryStore = inject(CategoryStore);

  // categoryForm: FormGroup<ICategoryForm>;
  categories: Signal<Category[]>;

  modalOpened = false;
  categoriesOpened = false;

  showToast = false;

  toastInfo = signal<ToastInfo>({
    text: '',
  });

  constructor() {
    this.categories = this.categoryStore.categories;
  }

  public handleAccordionState() {
    this.categoriesOpened = !this.categoriesOpened;
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
      // toast is not working if more than 1 actions is performed.
      error: () => {
        this.showToast = true;
        this.toastInfo.set({
          text: 'Failed to delete category.',
          type: 'error',
        });
      },
    });
  }

  showModal() {
    this.modalOpened = true;
  }

  handleCloseToast() {
    this.showToast = false;
  }

  handleCreateCategory() {
    this.modalOpened = false;
    this.toastInfo.set({
      text: 'Successfully created a category.',
      type: 'success',
    });
    this.showToast = true;
  }
}
