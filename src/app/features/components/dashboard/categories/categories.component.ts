import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '@core/services/category.service';
import { ModalService } from '@core/services/modal.service';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'jet-categories',
  imports: [ModalComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  categoryService = inject(CategoryService);
  modalService = inject(ModalService);

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe();
  }

  get categories() {
    return this.categoryService.categories();
  }

  openModal(): void {
    this.modalService.showModal();
  }
}
