import { Component, input } from '@angular/core';

@Component({
  selector: 'jet-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  heading = input<string>('');
  content = input();
  actions = input();
}
