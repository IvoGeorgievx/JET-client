import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, input, output, TemplateRef } from '@angular/core';

@Component({
  selector: 'jet-modal',
  imports: [NgTemplateOutlet, CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  headingTemplate = input.required<TemplateRef<any>>();
  contentTemplate = input.required<TemplateRef<any>>();
  actionsTemplate = input<TemplateRef<any>>();

  closeWithBackdrop = input<boolean>(true);

  isOpen = input.required<boolean>();
  showCloseButton = input<boolean>(true);

  onSave = output();
  onCancel = output();
}
