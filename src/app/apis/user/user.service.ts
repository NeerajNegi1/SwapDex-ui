import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  userLoginSignup(userWalletAddress: String, walletName?: String) {
    return this.http.post(`${this.apiUrl}user/user-login-signup`, {
      userWalletAddress,
      walletName,
    });
  }
}
