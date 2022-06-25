import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { SwapCardComponent } from './pages/swap-card/swap-card.component';
import { HoverBorderDirective } from './directive/hover-border.directive';
import { environment } from 'src/environments/environment';
import { AppStore } from './store';
import { CryptoCoinsModalComponent } from './component/crypto-coins-modal/crypto-coins-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SwapCardComponent,
    HoverBorderDirective,
    CryptoCoinsModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreDevtoolsModule.instrument({
      name: 'SwapDex',
      logOnly: environment.production
    }),
    AppStore
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
