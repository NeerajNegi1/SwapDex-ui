import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { toggleModelActions } from 'src/app/store/actions/ui.actions';
import allImages from 'src/assets/allImages';

@Component({
  selector: 'app-crypto-coins-modal',
  templateUrl: './crypto-coins-modal.component.html',
  styleUrls: ['./crypto-coins-modal.component.scss']
})
export class CryptoCoinsModalComponent implements OnInit {
  toggleModel: Boolean = false;
  closeImg: String = allImages.closeImg;
  ethereum: String = allImages.ethereum;

  constructor(private store: Store<any>) {
    this.store.select('ui').subscribe(data => {
      this.toggleModel = data.toggleModel;
    })
   }

  ngOnInit(): void {
    
  }
  closeModalHandler(){
    this.store.dispatch(toggleModelActions());
  }
}
