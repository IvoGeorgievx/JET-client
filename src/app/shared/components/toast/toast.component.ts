import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';

@Component({
  selector: 'jet-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent implements OnInit {
  text = input.required<string>();
  type = input<'info' | 'success' | 'error'>('info');
  duration = input(3000);

  isVisible = true;

  closed = output();

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible = false;
      this.closed.emit();
    }, this.duration());
  }

  getToastClass(type: 'info' | 'success' | 'error') {
    switch (type) {
      case 'info':
        return 'alert-info';
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-error';
      default:
        return 'alert-info';
    }
  }
}
