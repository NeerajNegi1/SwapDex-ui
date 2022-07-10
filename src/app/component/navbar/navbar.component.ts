import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserService } from 'src/app/apis/user/user.service';
import { WalletConnectService } from 'src/app/service/wallet/wallet-connect.service';
import { connectWalletNavLoaderActions } from 'src/app/store/actions/ui.actions';
import { setUserWalletAddress } from 'src/app/store/actions/user.actions';
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

  constructor(
    private store: Store<any>,
    private _walletConnectService: WalletConnectService,
    private _userLoginSignup: UserService
  ) {
    this.store.select('ui').subscribe((data) => {
      this.connectWalletNavLoader = data.connectWalletNavLoader;
    });
    this.store.select('user').subscribe((data) => {
      this.isWalletConnected = data.isWalletConnected;
      this.userWalletAddress = data.userWalletAddress;
    });
  }

  ngOnInit(): void {}

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
      return; // have to create a snackbar popup to show user that he/she is not connected to wallet
    }

    console.log(await this._walletConnectService.getChainId());

    this._userLoginSignup
      .userLoginSignup(response)
      .subscribe((response: any) => {
        userSavedResponse = response['data'];
        this.store.dispatch(
          setUserWalletAddress({
            userWalletAddress: userSavedResponse.userWalletAddress,
            walletName: userSavedResponse.walletName,
          })
        );
        this.store.dispatch(
          connectWalletNavLoaderActions({ connectWalletNavLoader: false })
        );
      });
  }
}
