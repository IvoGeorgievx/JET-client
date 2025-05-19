import { computed, Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalOpenedSignal: WritableSignal<boolean> = signal<boolean>(false);
  public readonly modalOpened = computed(() => this.modalOpenedSignal());

  public showModal() {
    this.modalOpenedSignal.set(true);
  }

  public hideModal() {
    this.modalOpenedSignal.set(false);
  }
}
