import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { UserStore } from '@core/store/user.store';
import { combineLatest, filter, map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private userStore = inject(UserStore);
  private router = inject(Router);

  private isHydrated$ = this.userStore.isHydrated$;
  private isLoggedIn$ = this.userStore.isLoggedIn$;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return combineLatest([this.isHydrated$, this.isLoggedIn$]).pipe(
      filter(([isHydrated, isLoggedIn]) => isHydrated && isLoggedIn),
      map(([, isLoggedIn]) => {
        if (!isLoggedIn) {
          return this.router.createUrlTree(['login']);
        }
        return true;
      }),
      take(1)
    );
  }
}
