import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserProfile } from '@/app/shared/models/profile.model';
import { BASE_API_URL } from '@/app/shared/utils/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly http = inject(HttpClient);

  readonly profile = signal<UserProfile | null>(null);

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${BASE_API_URL}user/profile`);
  }

  clearProfile(): void {
    this.profile.set(null);
  }
}
