import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Category } from '@shared/types/category.type';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private categoriesSignal = signal<Category[] | []>([]);
  public categories = computed(() => this.categoriesSignal());

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('http://localhost:8081/category/all').pipe(
      tap((data) => this.categoriesSignal.set(data)),
      catchError((error) => {
        this.categoriesSignal.set([]);
        return throwError(() => error);
      })
    );
  }
}
