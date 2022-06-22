import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { toggleNavNetworkActions } from 'src/app/store/actions/ui.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  toggleNavNetwork: boolean = false;

  constructor(private store: Store<any>) {
    this.store.select('ui').subscribe(data => {
      this.toggleNavNetwork = data.toggleNavNetwork;
    })
   }

  ngOnInit(): void {
  }

  toggleNavDropdown() {
    this.store.dispatch(toggleNavNetworkActions());
  }
  selectNetwork(network: string) {
    
  }
}
