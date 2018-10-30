import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiUrlService } from '../api-url/api-url.service';
import * as moment from 'moment';
import { CoreModule } from '../../core.module';

@Injectable({ providedIn: CoreModule })
export class AuthService {
  constructor(private http: HttpClient, private apiUrlService: ApiUrlService) { }

  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrlService.API_URL}/auth/login/`, { username, password })
      .pipe(map((authResult: { idToken: string, expiresIn: number, user: { id: number, username: string } }) => {
        // login successful if there's a jwt token in the response
        if (authResult && authResult.idToken) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          return this.setSession(authResult);
        }
      }));
  }

  private setSession(authResult: { idToken: string; expiresIn: number; user: { id: number; username: string; }; }) {
    localStorage.setItem('currentUser', JSON.stringify(authResult.user));
    const expiresAt = moment().add(authResult.expiresIn, 'second');
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt));
    return authResult.user;
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }
  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}