import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { CreateCategoryComponent } from '../dashboard/categories/create-category/create-category.component';

@Component({
  selector: 'jet-welcome-flow',
  imports: [ModalComponent, CommonModule, CreateCategoryComponent],
  templateUrl: './welcome-flow.component.html',
  styleUrl: './welcome-flow.component.css',
})
export class WelcomeFlowComponent {
  modalClosed = output();
  opened = input.required<boolean>();
  categoryCreated = false;

  currentStep = 0;

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  get disableNextPage() {
    return !this.categoryCreated && this.currentStep === 1;
  }
}
