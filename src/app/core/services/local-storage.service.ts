import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  setItem(name: string, value: string): void {
    localStorage.setItem(name, value);
  }

  getItem(name: string): string | null {
    return localStorage.getItem(name);
  }

  removeItem(name: string): void {
    localStorage.removeItem(name);
  }

  setObject<T>(name: string, value: T): void {
    localStorage.setItem(name, JSON.stringify(value));
  }

  getObject<T>(name: string): T | null {
    const item = localStorage.getItem(name);
    return item ? (JSON.parse(item) as T) : null;
  }
}
