import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserStore } from '@core/store/user.store';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private userStore = inject(UserStore);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    if (this.userStore.isLoggedIn()) {
      return true;
    }
    return this.router.createUrlTree(['login']);
  }
}
