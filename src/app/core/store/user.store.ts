import { computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthService } from '@core/services/auth.service';
import { LocalStorageService } from '@core/services/local-storage.service';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { User } from '@shared/types/user.type';
import { pipe, switchMap, tap } from 'rxjs';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

const initialUserState: User = {
  id: null,
  username: null,
  isLoading: false,
  isFirstLogin: null,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withDevtools('user'),
  withState({ ...initialUserState, userHydrated: false }),

  withProps((store) => {
    const idSignal = store.id;
    const usernameSignal = store.username;
    const isHydratedSignal = store.userHydrated;
    const isLoggedIn$ = toObservable(
      computed(() => !!idSignal() && !!usernameSignal())
    );
    const isHydrated$ = toObservable(isHydratedSignal);
    return {
      _authService: inject(AuthService),
      _localStorageService: inject(LocalStorageService),
      isLoggedIn: computed(() => {
        const id = idSignal();
        const username = usernameSignal();
        return !!id && !!username;
      }),
      isLoggedIn$,
      isHydrated$,
    };
  }),

  withMethods((store) => ({
    fetchCurrentUser: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, {
            isLoading: true,
          });
        }),
        switchMap(() => {
          return store._authService.getCurrentUser().pipe(
            tapResponse({
              next: (response) => {
                patchState(store, {
                  id: response.id,
                  username: response.username,
                  userHydrated: true,
                  isFirstLogin: response.isFirstLogin,
                });
              },
              error: (err) => {
                patchState(store, { userHydrated: true });
              },
              finalize: () => {
                patchState(store, { isLoading: false });
              },
            })
          );
        })
      )
    ),

    setUser(user: User) {
      patchState(store, {
        id: user.id,
        username: user.username,
        userHydrated: true,
        isFirstLogin: user.isFirstLogin,
      });
    },

    logout() {
      store._localStorageService.removeItem('token');
      patchState(store, {
        id: null,
        username: null,
        userHydrated: true,
      });
    },
  })),

  withHooks({
    onInit(store) {
      const token = store._localStorageService.getItem('token');
      if (token) {
        store.fetchCurrentUser();
      } else {
        patchState(store, { userHydrated: true });
      }
    },
  })
);
