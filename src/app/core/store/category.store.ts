import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import { CategoryService } from '@core/services/category.service';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { Category } from '@shared/types/category.type';
import { catchError, Observable, takeUntil, tap } from 'rxjs';

const initialState = {
  categories: [] as Category[],
  isLoading: false,
  error: null as string | null,
};

export const CategoryStore = signalStore(
  { providedIn: 'root' },
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

    createCategory: (body: {
      name: string;
      type: string;
      budget: number | null;
    }): Observable<Category> => {
      patchState(store, { isLoading: true, error: null });
      return store._categoryService.createCategory(body).pipe(
        tap((category) => {
          patchState(store, {
            isLoading: false,
            categories: [...store.categories(), category],
          });
        }),
        catchError((error) => {
          patchState(store, {
            isLoading: false,
            error: error.message || 'Failed to create category',
          });
          throw error;
        })
      );
    },

    deleteCategory: (id: string) => {
      patchState(store, {
        isLoading: true,
        error: null,
      });
      return store._categoryService.deleteCategory(id).pipe(
        tap(() => {
          const categories = store
            .categories()
            .filter((category) => category.id !== id);
          patchState(store, {
            isLoading: false,
            categories,
          });
        }),
        catchError((error) => {
          patchState(store, {
            isLoading: false,
            error: error.message || 'Failed to delete category',
          });
          throw error;
        })
      );
    },
  })),

  withHooks({
    onInit: (store) => {
      store.getCategories();
    },
  })
);
