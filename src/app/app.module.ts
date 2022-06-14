import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { SwapCardComponent } from './pages/swap-card/swap-card.component';
import { HoverBorderDirective } from './directive/hover-border.directive';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SwapCardComponent,
    HoverBorderDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
