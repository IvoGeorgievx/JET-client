import { Component, effect, inject, OnInit } from '@angular/core';
import { UserStore } from '@core/store/user.store';

@Component({
  selector: 'jet-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  userStore = inject(UserStore);

  constructor() {
    effect(() => {
      console.log('ID:', this.userStore.id());
      console.log('Username:', this.userStore.username());
      console.log('isLoggedIn:', this.userStore.isLoggedIn());
    });
  }
}
