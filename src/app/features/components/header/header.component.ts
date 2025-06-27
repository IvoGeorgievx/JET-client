import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserStore } from '@core/store/user.store';

@Component({
  selector: 'jet-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  userStore = inject(UserStore);
  router = inject(Router);

  logout() {
    this.userStore.logout();
    this.router.navigate(['login']);
  }
}
