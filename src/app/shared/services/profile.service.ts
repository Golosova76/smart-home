import type { WritableSignal } from "@angular/core";
import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import type { UserProfile } from "@/app/shared/models/profile.model";
import { BASE_API_URL } from "@/app/shared/utils/constants";
import type { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  private readonly http: HttpClient = inject(HttpClient);

  public readonly profile: WritableSignal<UserProfile | null> =
    signal<UserProfile | null>(null);

  public getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${BASE_API_URL}user/profile`);
  }

  public clearProfile(): void {
    this.profile.set(null);
  }
}
