import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CryptoDataService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getCryptoTokens() {
    return this.http.get(`${this.apiUrl}chains`);
  }
}
