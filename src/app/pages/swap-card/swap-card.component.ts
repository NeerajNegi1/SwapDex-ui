import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CryptoDataService } from 'src/app/apis/crypto-data/crypto-data.service';
import { UserService } from 'src/app/apis/user/user.service';
import { SnackbarToggleService } from 'src/app/service/snackbar/snackbar-toggle.service';
import { WalletConnectService } from 'src/app/service/wallet/wallet-connect.service';
import {
  setBuyCoin,
  setCryptoData,
  setSellCoin,
} from 'src/app/store/actions/crypto-data.actions';
import {
  buySellModeActions,
  connectWalletNavLoaderActions,
  toggleModelActions,
} from 'src/app/store/actions/ui.actions';
import {
  setChainData,
  setUserWalletAddress,
} from 'src/app/store/actions/user.actions';
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
  userStore: any;

  showerror: any;
  timer = 16;
  timeout: any;
  debouncer: any;
  isWalletConnected: boolean = false;
  userWalletAddress: string = '';
  cryptoData = [];
  connectWalletNavLoader: boolean = false;

  constructor(
    private store: Store<any>,
    private _cryptoDataService: CryptoDataService,
    private _walletConnectService: WalletConnectService,
    private _userLoginSignup: UserService,
    private _snackbarService: SnackbarToggleService
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
      this.cryptoData = data.cryptoData;
      this.setDataInToken('buy', data.buyCoin);
      setTimeout(() => {
        this.setDataInToken('sell', data.sellCoin);
      }, 100);
      this.timer = 16;
    });
    this.uiStore = this.store.select('ui').subscribe((data) => {
      this.showerror = data.showerror;
      this.connectWalletNavLoader = data.connectWalletNavLoader;
      if (!data.toggleModel) {
        this.timer = 16;
        this.getQuotation();
      }
    });
    this.userStore = this.store.select('user').subscribe((data) => {
      this.isWalletConnected = data.isWalletConnected;
      this.userWalletAddress = data.userWalletAddress;
    });
  }

  ngOnDestroy(): void {
    this.cryptoDataStore.unsubscribe();
    this.uiStore.unsubscribe();
    this.userStore.unsubscribe();
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

  sellTokenValueChangeHandler() {
    if (this.debouncer) clearTimeout(this.debouncer);

    if (
      !this.buyCoin.state ||
      !this.sellCoin.state ||
      isNaN(parseFloat(this.sellTokenValue)) ||
      this.sellTokenValue < 0
    ) {
      this.buyTokenValue = 0;
      return;
    }

    this.debouncer = setTimeout(() => {
      this.timer = 14;
      this.fetchQuotations();
      this.getQuotation();
    }, 500);
  }

  async connectWallet() {
    let userSavedResponse: any;

    this.store.dispatch(
      connectWalletNavLoaderActions({ connectWalletNavLoader: true })
    );
    let response: any = await this._walletConnectService.connectToWallet();

    if (!response) {
      this.store.dispatch(
        connectWalletNavLoaderActions({ connectWalletNavLoader: false })
      );
      return;
    }

    const chainId = await this._walletConnectService.getChainId();
    this.setChainDataHandler(chainId, response);
    this._userLoginSignup
      .userLoginSignup(response)
      .subscribe((response: any) => {
        userSavedResponse = response['data'];
        this.store.dispatch(
          setUserWalletAddress({
            userWalletAddress: userSavedResponse.userWalletAddress,
            walletName: userSavedResponse.walletName,
            chainId: chainId,
          })
        );
        this.store.dispatch(
          connectWalletNavLoaderActions({ connectWalletNavLoader: false })
        );
      });
  }

  setChainDataHandler(chainId: string, walletAddress = '') {
    this.cryptoData.forEach(async (coin: any) => {
      if (parseInt(chainId) === coin.chainId) {
        let balance: any = await this._walletConnectService.getBalance({
          userAddress:
            this.userWalletAddress.length !== 0
              ? this.userWalletAddress
              : walletAddress,
          decimal: coin.defaultCoinDetails.decimals,
        });
        this.store.dispatch(
          setChainData({
            currentChainBalance: parseFloat(balance),
            currentChainSymbol: coin.defaultCoinDetails.symbol,
            currentChainImage: coin.defaultCoinDetails.image,
            currentChainName: coin.defaultCoinDetails.name,
          })
        );
      }
    });
  }

  addChainToWallet(item: any) {
    let chain = {
      chainId: `0x${Number(item.chainId).toString(16)}`,
      chainName: item.name,
      nativeCurrency: {
        ...item.nativeCurrency,
      },
      rpcUrls: [...item.rpc],
      blockExplorerUrls: [...item.explorers.map((i: any) => i.url)],
      iconUrls: [item.defaultCoinDetails.image],
    };
    this._walletConnectService.switchWalletNetwork(chain);
  }

  async swapCryptoHandler() {
    if (!this.isWalletConnected) {
      this.connectWallet();
    } else {
      if (!this.buyCoin.state || !this.sellCoin.state) {
        this._snackbarService.snackbarToggle('Please select coins to swap.');
        return;
      }
      if (isNaN(parseInt(this.sellTokenValue)) || this.sellTokenValue <= 0) {
        this._snackbarService.snackbarToggle(
          'Please enter valid sell token value.'
        );
        return;
      }
      this.addChainToWallet(this.sellCoin.data);
      let balance = await this._walletConnectService.getBalance({
        userAddress: this.userWalletAddress,
        decimal: this.sellCoin.data.defaultCoinDetails.decimals,
      });
      if (balance < this.sellTokenValue) {
        this._snackbarService.snackbarToggle(
          'Your wallet does not have enough balance.'
        );
        return;
      }
      let response = this._cryptoDataService
        .createQuotations({
          buyCoinId: this.buyCoin.data._id,
          sellCoinId: this.sellCoin.data._id,
          sellCoinAmount:
            this.sellTokenValue *
            10 ** this.sellCoin.data.defaultCoinDetails.decimals,
          userWalletAddress: this.userWalletAddress,
        })
        .subscribe((response: any) => {
          console.log(response, 'from server');
        });

      // have to call to send crypto to wallet
    }
  }
}
