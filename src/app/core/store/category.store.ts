import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import { CategoryService } from '@core/services/category.service';
import {
  patchState,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { Category } from '@shared/types/category.type';
import { catchError, tap } from 'rxjs';

const initialState = {
  categories: [] as Category[],
  isLoading: false,
  error: null as string | null,
};

export const CategoryStore = signalStore(
  withState(initialState),

  withDevtools('categories'),

  withProps(() => ({
    _categoryService: inject(CategoryService),
  })),

  withMethods((store) => ({
    getCategories: () => {
      patchState(store, { isLoading: true, error: null });
      store._categoryService
        .getCategories()
        .pipe(
          tap((categories) => {
            patchState(store, { categories, isLoading: false });
          }),
          catchError((error) => {
            patchState(store, {
              error: error.message || 'Failed to load categories',
              isLoading: false,
            });
            throw error;
          })
        )
        .subscribe();
    },
  }))
);
