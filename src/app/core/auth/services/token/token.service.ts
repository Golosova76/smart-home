import { Injectable } from "@angular/core";
import { TOKEN_KEY } from "@/app/shared/utils/constants";
import { isNullOrEmpty } from "@/app/shared/utils/is-null-or-empty";

@Injectable({
  providedIn: "root",
})
export class TokenService {
  //сохраняет токен в localStorage
  public setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  //вернет токен из localStorage если есть и null если нет
  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // удаляет токен из localStorage
  public clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  //проверка есть токен в localStorage или нет
  public hasToken(): boolean {
    return !isNullOrEmpty(this.getToken());
  }
}
