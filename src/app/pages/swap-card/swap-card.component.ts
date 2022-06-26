import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { toggleModelActions } from 'src/app/store/actions/ui.actions';
import allImages from 'src/assets/allImages';

@Component({
  selector: 'app-swap-card',
  templateUrl: './swap-card.component.html',
  styleUrls: ['./swap-card.component.scss']
})
export class SwapCardComponent implements OnInit {

  dropdownWhite: String = allImages.dropdownWhite;
  infoIcon: String = allImages.infoIcon;
  ethereum: String = allImages.ethereum;
  dropdownBlack: String = allImages.dropdownBlack;
  swapIcon: String = allImages.swapIcon;

  constructor(private store: Store<any>) {
    
   }

  ngOnInit(): void {
  }

  toggleModelHandler(){
    this.store.dispatch(toggleModelActions());
  }

}
