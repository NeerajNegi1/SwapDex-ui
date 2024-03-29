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
  setIsSwapStarted,
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
  isSwapStarted: boolean = false;

  orderId: string = '';

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
      this.isSwapStarted = data.isSwapStarted;
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
      this.sellTokenValue <= 0
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
      this.sellTokenValue <= 0
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

  async createQuotation() {
    return new Promise((resolve, reject) => {
      this._cryptoDataService
        .createQuotations({
          buyCoinId: this.buyCoin.data._id,
          sellCoinId: this.sellCoin.data._id,
          sellCoinAmount:
            this.sellTokenValue *
            10 ** this.sellCoin.data.defaultCoinDetails.decimals,
          userWalletAddress: this.userWalletAddress,
        })
        .subscribe((response: any) => {
          this.orderId = response.orderId;
          resolve(true);
        });
    });
  }

  async verifyTransaction(hash: string) {
    return new Promise((resolve, reject) => {
      this._cryptoDataService
        .verifyTransaction({
          orderId: this.orderId,
          transactionHash: hash,
        })
        .subscribe((response: any) => {
          resolve(response);
        });
    });
  }

  transactionStatusMsgMapper: any = {
    Init: 'Transaction is being initiated...',
    CoinsReceived: 'Woohoo we received the coins.',
    TransferringCoins: 'Stay tuned, we are transferring the coins.',
    Success: 'Yay! We have transferred the coins. Please check your wallet.',
    Failed:
      'Unfortunately, the transaction has been failed. Sit back we will send your coins back.',
  };

  currentTime: any = 0;

  getTransactionStatus() {
    return new Promise((resolve, reject) => {
      this._cryptoDataService
        .transactionStatus(this.orderId)
        .subscribe((response: any) => {
          resolve(response);
        });
    });
  }

  async pollTransactionStatus() {
    if (this.currentTime < Date.now()) {
      this._snackbarService.snackbarToggle(
        this.transactionStatusMsgMapper['Failed']
      );
      this.store.dispatch(setIsSwapStarted({ state: false }));
      // have to call the return coin api
      return;
    }
    let { status }: any = await this.getTransactionStatus();
    console.log(status);
    if (!status || status === 'Failed') {
      this._snackbarService.snackbarToggle(
        this.transactionStatusMsgMapper['Failed']
      );
      this.store.dispatch(setIsSwapStarted({ state: false }));
      // have to call the return coin api
      return;
    }

    if (status === 'Success') {
      this._snackbarService.snackbarToggle(
        this.transactionStatusMsgMapper[status]
      );
      this.store.dispatch(setIsSwapStarted({ state: false }));
      return;
    }

    setTimeout(() => {
      this.pollTransactionStatus(); // have to add this status into the cache
    }, 5000);
    // quotation-status/:id
    // this.store.dispatch(setIsSwapStarted({ state: false }));
  }

  async swapCryptoHandler() {
    this.currentTime = Date.now() + 900000;
    if (!this.isWalletConnected) {
      this.connectWallet();
    } else {
      this.store.dispatch(setIsSwapStarted({ state: true }));
      if (!this.buyCoin.state || !this.sellCoin.state) {
        this._snackbarService.snackbarToggle('Please select coins to swap.');
        this.store.dispatch(setIsSwapStarted({ state: false }));
        return;
      }
      if (isNaN(parseInt(this.sellTokenValue)) || this.sellTokenValue <= 0) {
        this._snackbarService.snackbarToggle(
          'Please enter valid sell token value.'
        );
        this.store.dispatch(setIsSwapStarted({ state: false }));
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
        this.store.dispatch(setIsSwapStarted({ state: false }));
        return;
      }
      this._snackbarService.snackbarToggle(
        this.transactionStatusMsgMapper['Init']
      );
      await this.createQuotation();
      let response = await this._walletConnectService.sentTransaction({
        amount: this.sellTokenValue,
        decimal: this.sellCoin.data.defaultCoinDetails.decimals,
      });

      let isVerified: any = await this.verifyTransaction(response.hash);
      if (!isVerified.txStatus) {
        this._snackbarService.snackbarToggle('Transaction failed.');
        // have to create api for returning the balance to user
        this.store.dispatch(setIsSwapStarted({ state: false }));
        return;
      }
      this._snackbarService.snackbarToggle(
        this.transactionStatusMsgMapper['CoinsReceived']
      );

      this.pollTransactionStatus();
    }
  }
}
