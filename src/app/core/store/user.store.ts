import { computed, inject } from '@angular/core';
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
  withState({ ...initialUserState, isHydrated: false }),

  withProps((store) => ({
    _authService: inject(AuthService),
    _localStorageService: inject(LocalStorageService),
    isLoggedIn: computed(() => !!store.id() && !!store.username()),
  })),

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
                  isHydrated: true,
                  isFirstLogin: response.isFirstLogin,
                });
              },
              error: (err) => {
                console.error(err);
                patchState(store, { isHydrated: true });
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
        isHydrated: true,
        isFirstLogin: user.isFirstLogin,
      });
    },

    logout() {
      store._localStorageService.removeItem('token');
      patchState(store, {
        id: null,
        username: null,
        isHydrated: true,
      });
    },
  })),

  withHooks({
    onInit(store) {
      const token = store._localStorageService.getItem('token');
      if (token) {
        store.fetchCurrentUser();
      } else {
        patchState(store, { isHydrated: true });
      }
    },
  })
);
