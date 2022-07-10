import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  setBuyCoin,
  setSellCoin,
} from 'src/app/store/actions/crypto-data.actions';
import {
  showErrorMessage,
  toggleModelActions,
} from 'src/app/store/actions/ui.actions';
import allImages from 'src/assets/allImages';

@Component({
  selector: 'app-crypto-coins-modal',
  templateUrl: './crypto-coins-modal.component.html',
  styleUrls: ['./crypto-coins-modal.component.scss'],
})
export class CryptoCoinsModalComponent implements OnInit, OnDestroy {
  toggleModel: Boolean = false;
  closeImg: String = allImages.closeImg;
  ethereum: String = allImages.ethereum;

  originalCoinData: any = [];
  filteredCoinData: any = [];
  mode = '';
  sellCoin: any;
  buyCoin: any;
  uiStore: any;
  cryptoDataStore: any;

  constructor(private store: Store<any>) {}

  ngOnInit(): void {
    this.uiStore = this.store.select('ui').subscribe((data) => {
      this.mode = data.mode;
      this.toggleModel = data.toggleModel;
    });
    this.cryptoDataStore = this.store.select('cryptoData').subscribe((data) => {
      this.originalCoinData = data.cryptoData;
      this.sellCoin = data.sellCoin;
      this.buyCoin = data.buyCoin;
      this.searchCrypto({ target: { value: '' } });
    });
  }

  ngOnDestroy(): void {
    this.uiStore.unsubscribe();
    this.cryptoDataStore.unsubscribe();
  }

  closeModalHandler() {
    this.store.dispatch(toggleModelActions());
    this.searchCrypto({ target: { value: '' } });
  }

  searchCrypto(event: any) {
    this.filteredCoinData = this.originalCoinData.filter((coin: any) => {
      return coin.chain
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
  }

  selectCoinHandler(coin: any) {
    if (
      (this.mode === 'BuyToken' && coin._id === this.sellCoin._id) ||
      (this.mode === 'SellToken' && coin._id === this.buyCoin._id)
    ) {
      this.store.dispatch(
        showErrorMessage({
          msgPayload: {
            state: true,
            message: 'You cannot select the same coin twice.',
          },
        })
      );

      setTimeout(() => {
        this.store.dispatch(
          showErrorMessage({
            msgPayload: {
              state: false,
              message: '',
            },
          })
        );
      }, 5000);
      this.closeModalHandler();
      return;
    }

    if (this.mode === 'SellToken') {
      this.store.dispatch(setSellCoin({ sellCoin: coin }));
    }
    if (this.mode === 'BuyToken') {
      this.store.dispatch(setBuyCoin({ buyCoin: coin }));
    }
    this.closeModalHandler();
  }
}
