import { NgTemplateOutlet } from '@angular/common';
import { Component, input, output, TemplateRef } from '@angular/core';

@Component({
  selector: 'jet-modal',
  imports: [NgTemplateOutlet],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  headingTemplate = input.required<TemplateRef<any>>();
  contentTemplate = input.required<TemplateRef<any>>();
  actionsTemplate = input<TemplateRef<any>>();

  isOpen = input.required<boolean>();

  onSave = output();
  onCancel = output();
}
