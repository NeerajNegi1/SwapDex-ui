import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { SwapCardComponent } from './pages/swap-card/swap-card.component';
import { HoverBorderDirective } from './directive/hover-border.directive';
import { environment } from 'src/environments/environment';
import { AppStore } from './store';
import { CryptoCoinsModalComponent } from './component/crypto-coins-modal/crypto-coins-modal.component';
import { LoaderComponent } from './component/loader/loader.component';
import { AddressConverterPipe } from './pipe/address-converter.pipe';
import { StoreModule } from '@ngrx/store';
import { SnackbarComponent } from './component/snackbar/snackbar.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SwapCardComponent,
    HoverBorderDirective,
    CryptoCoinsModalComponent,
    LoaderComponent,
    AddressConverterPipe,
    SnackbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot(AppStore),
    !environment.production
      ? StoreDevtoolsModule.instrument({
          logOnly: environment.production,
        })
      : [],
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
