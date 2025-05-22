import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { local } from '@shared/constants/environments';
import { Category } from '@shared/types/category.type';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);

  private categoriesSignal = signal<Category[] | null>(null);
  public categories = computed(() => this.categoriesSignal());

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${local.API_URL}/category/all`).pipe(
      tap((data) => this.categoriesSignal.set(data)),
      catchError((error) => {
        this.categoriesSignal.set([]);
        return throwError(() => error);
      })
    );
  }

  createCategory(body: { name: string; type: string }): Observable<Category> {
    return this.http.post<Category>(`${local.API_URL}/category/new`, body);
  }
}
