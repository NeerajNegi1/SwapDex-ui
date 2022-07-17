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
  getFetchQuotations(buyCoin: any, sellCoin: any, sellTokenAmount: number) {
    return this.http.post(`${this.apiUrl}quotaions`, {
      buyTokenId: buyCoin.data.defaultCoinDetails.uniqueId,
      sellTokenId: sellCoin.data.defaultCoinDetails.uniqueId,
      sellTokenAmount,
    });
  }
  createQuotations(data: any) {
    return this.http.post(`${this.apiUrl}create-quotations`, data);
  }
  verifyTransaction(data: any) {
    return this.http.post(`${this.apiUrl}verify-transaction`, data);
  }

  transactionStatus(id: string) {
    return this.http.get(`${this.apiUrl}quotation-status/${id}`);
  }
}
