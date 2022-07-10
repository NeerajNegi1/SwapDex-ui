import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserService } from 'src/app/apis/user/user.service';
import { WalletConnectService } from 'src/app/service/wallet/wallet-connect.service';
import { connectWalletNavLoaderActions } from 'src/app/store/actions/ui.actions';
import {
  setChainData,
  setUserWalletAddress,
} from 'src/app/store/actions/user.actions';
import allImages from 'src/assets/allImages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  logo: String = allImages.logo;
  ethereum: String = allImages.ethereum;
  dropdownBlack: String = allImages.dropdownBlack;
  connectWalletNavLoader: boolean = false;
  isWalletConnected: Boolean = false;
  userWalletAddress: String = '';
  symbol: String = '';
  balance: number = 0;
  image: String = '';
  chainName: String = '';
  chainId: string = '';

  cryptoData = [];

  constructor(
    private store: Store<any>,
    private _walletConnectService: WalletConnectService,
    private _userLoginSignup: UserService
  ) {}

  ngOnInit(): void {
    this.store.select('ui').subscribe((data) => {
      this.connectWalletNavLoader = data.connectWalletNavLoader;
    });
    this.store.select('user').subscribe((data) => {
      this.isWalletConnected = data.isWalletConnected;
      this.userWalletAddress = data.userWalletAddress;
      this.symbol = data.currentChainSymbol;
      this.balance = data.currentChainBalance.toFixed(5);
      this.image = data.currentChainImage;
      this.chainName = data.currentChainName;
      this.chainId = data.currentChainId;
    });
    this.store.select('cryptoData').subscribe((data) => {
      this.cryptoData = data.cryptoData;
    });
    this._walletConnectService.chainNetworkHandler();
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
}
