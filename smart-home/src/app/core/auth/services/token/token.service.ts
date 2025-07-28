import { Injectable } from '@angular/core';
import {TOKEN_KEY} from '@/app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  //сохраняет токен в localStorage
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  //вернет токен из localStorage если есть и null если нет
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // удаляет токен из localStorage
  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  //проверка есть токен в localStorage или нет
  hasToken(): boolean {
    return !!this.getToken();
  }

}
