import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { UserStore } from '@core/store/user.store';
import { combineLatest, filter, map, Observable, take } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private userStore = inject(UserStore);
  private router = inject(Router);

  private isHydrated$ = toObservable(this.userStore.isHydrated);
  private isLoggedIn$ = toObservable(this.userStore.isLoggedIn);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return combineLatest([this.isHydrated$, this.isLoggedIn$]).pipe(
      filter(([isHydrated]) => isHydrated),
      // once isHydrated is true, then the map checks the login status
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
