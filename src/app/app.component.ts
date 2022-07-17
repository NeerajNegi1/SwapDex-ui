import { Component } from '@angular/core';

declare global {
  interface Window {
    ethereum?: any;
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
