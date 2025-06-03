import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { local } from '@shared/constants/environments';
import { Category } from '@shared/types/category.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${local.API_URL}/category/all`);
  }

  createCategory(body: {
    name: string;
    type: string;
    budget: number | null;
  }): Observable<Category> {
    return this.http.post<Category>(`${local.API_URL}/category/new`, body);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.post<void>(`${local.API_URL}/category/delete`, id);
  }
}
