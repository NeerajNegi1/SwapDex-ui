import { Component } from '@angular/core';
import { MetaMaskInpageProvider } from '@metamask/providers';
declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'SwapDex-ui';
}
