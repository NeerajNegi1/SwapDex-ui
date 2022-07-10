import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CryptoDataService } from 'src/app/apis/crypto-data/crypto-data.service';
import {
  setBuyCoin,
  setCryptoData,
  setSellCoin,
} from 'src/app/store/actions/crypto-data.actions';
import {
  buySellModeActions,
  toggleModelActions,
} from 'src/app/store/actions/ui.actions';
import allImages from 'src/assets/allImages';

@Component({
  selector: 'app-swap-card',
  templateUrl: './swap-card.component.html',
  styleUrls: ['./swap-card.component.scss'],
})
export class SwapCardComponent implements OnInit, OnDestroy {
  dropdownWhite: String = allImages.dropdownWhite;
  infoIcon: String = allImages.infoIcon;
  ethereum: String = allImages.ethereum;
  dropdownBlack: String = allImages.dropdownBlack;
  swapIcon: String = allImages.swapIcon;

  oneUnitBuyTokenValue: number = 0;

  buyCoin: any = {
    state: false,
    data: {},
  };
  sellCoin: any = {
    state: false,
    data: {},
  };

  quotationData = {
    state: false,
    data: {
      totalBuyTokenReceivedByUser: 0,
      priceForOneUnitOfBuyToken: 0,
    },
  };

  sellTokenValue: any;
  buyTokenValue: any;

  cryptoDataStore: any;
  uiStore: any;
  showerror: any;
  timer = 16;
  timeout: any;
  debouncer: any;

  constructor(
    private store: Store<any>,
    private _cryptoDataService: CryptoDataService
  ) {}

  setDataInToken(type: String, data: any) {
    let state = Object.keys(data).length > 0 ? true : false;
    if (type === 'buy') {
      this.buyCoin = { state, data };
    }
    if (type === 'sell') {
      this.sellCoin = { state, data };
    }
  }

  ngOnInit(): void {
    this._cryptoDataService.getCryptoTokens().subscribe((response: any) => {
      if (response.success) {
        this.store.dispatch(
          setCryptoData({
            cryptoData: response.data.chains,
          })
        );
      }
    });
    this.cryptoDataStore = this.store.select('cryptoData').subscribe((data) => {
      this.setDataInToken('buy', data.buyCoin);
      setTimeout(() => {
        this.setDataInToken('sell', data.sellCoin);
      }, 100);
      this.timer = 16;
    });
    this.uiStore = this.store.select('ui').subscribe((data) => {
      this.showerror = data.showerror;
      if (!data.toggleModel) {
        this.timer = 16;
        this.getQuotation();
      }
    });
  }

  ngOnDestroy(): void {
    this.cryptoDataStore.unsubscribe();
    this.uiStore.unsubscribe();
  }

  toggleModelHandler(type: String) {
    this.store.dispatch(toggleModelActions());
    this.store.dispatch(buySellModeActions({ mode: type }));
  }

  getQuotation() {
    if (
      !this.buyCoin.state ||
      !this.sellCoin.state ||
      isNaN(parseFloat(this.sellTokenValue)) ||
      this.sellTokenValue < 0
    )
      return;

    if (this.timeout) clearTimeout(this.timeout);

    if (this.timer === 0 || this.timer === 15) {
      this.timer = 15;
      this.fetchQuotations();
    }

    this.timeout = setTimeout(() => {
      this.timer--;
      this.getQuotation();
    }, 1000);
  }

  swapCoinHandler() {
    if (!this.buyCoin.state || !this.sellCoin.state) return;

    this.store.dispatch(setSellCoin({ sellCoin: this.buyCoin.data }));
    this.store.dispatch(setBuyCoin({ buyCoin: this.sellCoin.data }));
    this.getQuotation();
  }

  fetchQuotations() {
    this._cryptoDataService
      .getFetchQuotations(this.buyCoin, this.sellCoin, this.sellTokenValue)
      .subscribe((response: any) => {
        if (response.success) {
          this.quotationData = {
            state: true,
            data: {
              totalBuyTokenReceivedByUser:
                response.data.totalBuyTokenReceivedByUser,
              priceForOneUnitOfBuyToken:
                response.data.priceForOneUnitOfBuyToken,
            },
          };
          this.buyTokenValue = response.data.totalBuyTokenReceivedByUser;
        }
      });
  }

  sellTokenValueChangeHandler(value: any) {
    if (this.debouncer) clearTimeout(this.debouncer);

    if (
      !this.buyCoin.state ||
      !this.sellCoin.state ||
      isNaN(parseFloat(this.sellTokenValue)) ||
      this.sellTokenValue < 0
    ) {
      this.quotationData = {
        state: false,
        data: {
          totalBuyTokenReceivedByUser: 0,
          priceForOneUnitOfBuyToken: 0,
        },
      };
      this.buyTokenValue = 0;
      return;
    }

    this.debouncer = setTimeout(() => {
      this.fetchQuotations();
    }, 500);
  }
}
