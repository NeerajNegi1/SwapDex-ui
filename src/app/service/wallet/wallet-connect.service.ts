import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { setcurrentChainId } from 'src/app/store/actions/user.actions';
import { ethers } from 'ethers';

@Injectable({
  providedIn: 'root',
})
export class WalletConnectService {
  constructor(private store: Store<any>) {}

  async connectToWallet() {
    const { ethereum } = window;
    if (!ethereum) return;
    let response: any = await ethereum.request({
      method: 'eth_requestAccounts',
    });
    if (response.error) {
      return false;
    }
    return response[0];
  }

  async getChainId() {
    const { ethereum } = window;
    if (!ethereum) return;
    let response: any = await ethereum.request({ method: 'eth_chainId' });
    return response;
  }

  async chainNetworkHandler() {
    const { ethereum } = window;
    if (!ethereum) return;
    ethereum.on('chainChanged', (chainId: any) => {
      this.store.dispatch(setcurrentChainId({ currentChainId: chainId }));
    });
  }

  async getWeb3JsProvider() {
    const { ethereum } = window;
    if (!ethereum) return;
    const provider = new ethers.providers.Web3Provider(ethereum);
    return provider;
  }

  async getBalance({ userAddress, decimal }: any) {
    let provider = await this.getWeb3JsProvider();
    let balance: any = await provider?.getBalance(userAddress);
    return balance / 10 ** decimal;
  }

  async switchWalletNetwork(chain: any) {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [chain],
    });
  }
}

// import {
//   setCurrentSelectedTokenAmount,
//   setIsUserWalletConnected,
//   setUserWalletAddress,
// } from "../store/Slices/LandingPageSlice";
// import Web3 from "web3";
// import { setFetchSelectedTokenBalance } from "../store/Slices/UiSlice";

// const polygon = {
//   chainName: "Polygon",
//   rpcUrls: [
//     "https://polygon-rpc.com/",
//     "https://rpc-mainnet.matic.network",
//     "https://matic-mainnet.chainstacklabs.com",
//     "https://rpc-mainnet.maticvigil.com",
//     "https://rpc-mainnet.matic.quiknode.pro",
//     "https://matic-mainnet-full-rpc.bwarelabs.com",
//   ],
//   nativeCurrency: {
//     name: "MATIC",
//     symbol: "MATIC",
//     decimals: 18,
//   },
//   chainId: `0x${(137).toString(16)}`,
//   blockExplorerUrls: ["https://polygonscan.com"],
// };

// const tokenAbi = [
//   {
//     constant: true,
//     inputs: [],
//     name: "name",
//     outputs: [
//       {
//         name: "",
//         type: "string",
//       },
//     ],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       {
//         name: "_spender",
//         type: "address",
//       },
//       {
//         name: "_value",
//         type: "uint256",
//       },
//     ],
//     name: "approve",
//     outputs: [
//       {
//         name: "",
//         type: "bool",
//       },
//     ],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "totalSupply",
//     outputs: [
//       {
//         name: "",
//         type: "uint256",
//       },
//     ],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       {
//         name: "_from",
//         type: "address",
//       },
//       {
//         name: "_to",
//         type: "address",
//       },
//       {
//         name: "_value",
//         type: "uint256",
//       },
//     ],
//     name: "transferFrom",
//     outputs: [
//       {
//         name: "",
//         type: "bool",
//       },
//     ],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "decimals",
//     outputs: [
//       {
//         name: "",
//         type: "uint8",
//       },
//     ],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [
//       {
//         name: "_owner",
//         type: "address",
//       },
//     ],
//     name: "balanceOf",
//     outputs: [
//       {
//         name: "balance",
//         type: "uint256",
//       },
//     ],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "symbol",
//     outputs: [
//       {
//         name: "",
//         type: "string",
//       },
//     ],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       {
//         name: "_to",
//         type: "address",
//       },
//       {
//         name: "_value",
//         type: "uint256",
//       },
//     ],
//     name: "transfer",
//     outputs: [
//       {
//         name: "",
//         type: "bool",
//       },
//     ],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [
//       {
//         name: "_owner",
//         type: "address",
//       },
//       {
//         name: "_spender",
//         type: "address",
//       },
//     ],
//     name: "allowance",
//     outputs: [
//       {
//         name: "",
//         type: "uint256",
//       },
//     ],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     payable: true,
//     stateMutability: "payable",
//     type: "fallback",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         name: "owner",
//         type: "address",
//       },
//       {
//         indexed: true,
//         name: "spender",
//         type: "address",
//       },
//       {
//         indexed: false,
//         name: "value",
//         type: "uint256",
//       },
//     ],
//     name: "Approval",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         name: "from",
//         type: "address",
//       },
//       {
//         indexed: true,
//         name: "to",
//         type: "address",
//       },
//       {
//         indexed: false,
//         name: "value",
//         type: "uint256",
//       },
//     ],
//     name: "Transfer",
//     type: "event",
//   },
// ];

// const connectToWallet = async ({ dispatch }) => {
//   try {
//     if (!window.ethereum) return;
//     let response = await ethereum.request({ method: "eth_requestAccounts" });
//     if (response) {
//       dispatch(setIsUserWalletConnected(true));
//       dispatch(setUserWalletAddress(response[0]));
//       // have to check the chain is polygon or not other switch the chain
//       // switchWalletNetwork({ chainName: "Polygon" });
//       return response[0];
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// const chainNetworkHandler = async ({ fun, dispatch }) => {
//   try {
//     if (!window.ethereum) return;
//     ethereum.on("chainChanged", (chainId) => {
//       setTimeout(() => {
//         fun?.({ chainId });
//       }, 2000);
//       dispatch(setFetchSelectedTokenBalance()); // for refreshing the balance in ui
//       // console.log(chainId, "chain changed");
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// const changeAccountHandler = async ({ dispatch }) => {
//   try {
//     if (!window.ethereum) return;
//     ethereum.on("accountsChanged", (accounts) => {
//       // console.log(accounts, "accounts");
//       dispatch(setFetchSelectedTokenBalance()); // for refreshing the balance in ui
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// const getChainId = async () => {
//   try {
//     if (!window.ethereum) return;
//     let response = await ethereum.request({ method: "eth_chainId" });
//     return response;
//   } catch (error) {
//     console.log(error);
//   }
// };

// const switchWalletNetwork = async ({ chainName }) => {
//   try {
//     if (!window.ethereum) return;
//     await window.ethereum.request({
//       method: "wallet_switchEthereumChain",
//       params: [{ chainId: polygon.chainId }],
//     });
//   } catch (error) {
//     await window.ethereum.request({
//       method: "wallet_addEthereumChain",
//       params: [polygon],
//     });
//     console.log(error);
//   }
// };

// const addTokenToWallet = async (token) => {
//   try {
//     if (!window.ethereum) return;
//     let response = window.ethereum.request({
//       method: "wallet_watchAsset",
//       params: {
//         type: "ERC20",
//         options: {
//           address: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
//           symbol: "WMATIC",
//           decimals: 18,
//           image: "https://ik.imagekit.io/z3vwasz5xwz/ethereum_cahEVKAbv.svg",
//         },
//       },
//     });
//     // console.log(response);
//   } catch (error) {
//     console.log(error);
//   }
// };

// const getBalance = async ({
//   userAddress,
//   isToken,
//   tokenAddress,
//   dispatch,
//   decimal,
// }) => {
//   try {
//     let web3 = await getWeb3JsProvider();
//     let balance = 0;
//     if (isToken) {
//       // if is token then get the balance from the token contract
//       let contract = new web3.eth.Contract(tokenAbi, tokenAddress);
//       balance = await contract.methods.balanceOf(userAddress).call();
//     } else {
//       // if not token then it means its default curreny of selected chain
//       balance = await web3.eth.getBalance(userAddress);
//     }
//     dispatch(setCurrentSelectedTokenAmount(balance / 10 ** decimal));
//   } catch (error) {
//     console.log(error);
//   }
// };

// const sentTransaction = async ({
//   userAddress,
//   isToken,
//   tokenAddress,
//   dispatch,
//   decimal,
//   amount,
//   to,
// }) => {
//   try {
//     let web3 = await getWeb3JsProvider();

//     if (isToken) {
//       let amountToSendByUser = web3.utils.toHex(web3.utils.toWei(amount));
//       // if token the have to send transaction to token contract
//       let contract = new web3.eth.Contract(tokenAbi, tokenAddress);
//       let response = await contract.methods
//         .transfer(to, amountToSendByUser)
//         .send({ from: userAddress });
//       console.log(response, "from sentTransaction");

//       dispatch(setFetchSelectedTokenBalance());
//     } else {
//       // if not token then it means its default curreny of selected chain
//     }

//     // need to explore a way of sending tokens from one address to another
//     // ==========================================================================================
//     //  this is the case for the default currency
//     // const transactionParameters = {
//     //   nonce: "0x00", // ignored by MetaMask
//     //   gasPrice: "0x09184e72a000", // customizable by user during MetaMask confirmation.
//     //   gas: "0x2710", // customizable by user during MetaMask confirmation.
//     //   to: "0x0000000000000000000000000000000000000000", // Required except during contract publications.
//     //   from: ethereum.selectedAddress, // must match user's active address.
//     //   value: "0x00", // Only required to send ether to the recipient from the initiating external account.
//     //   data: "0x7f7465737432000000000000000000000000000000000000000000000000000000600057", // Optional, but used for defining smart contract creation and interaction.
//     //   chainId: "0x3", // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
//     // };
//     // // txHash is a hex string
//     // // As with any RPC call, it may throw an error
//     // const txHash = await ethereum.request({
//     //   method: "eth_sendTransaction",
//     //   params: [transactionParameters],
//     // });
//   } catch (error) {
//     console.log(error);
//   }
// };

// export {
//   switchWalletNetwork,
//   getWeb3JsProvider,
//   chainNetworkHandler,
//   addTokenToWallet,
//   connectToWallet,
//   getChainId,
//   changeAccountHandler,
//   sentTransaction,
//   getBalance,
// };

// let web3 = window.web3;
// const contract = new web3.eth.Contract(
//   [
//     {
//       constant: false,
//       inputs: [
//         {
//           name: "newDeposit",
//           type: "uint256",
//         },
//       ],
//       name: "send",
//       outputs: [],
//       payable: false,
//       stateMutability: "nonpayable",
//       type: "function",
//     },
//     {
//       inputs: [
//         {
//           name: "initialAmount",
//           type: "uint256",
//         },
//         {
//           name: "initialValue",
//           type: "uint256",
//         },
//       ],
//       payable: false,
//       stateMutability: "nonpayable",
//       type: "constructor",
//     },
//     {
//       constant: true,
//       inputs: [],
//       name: "getAmount",
//       outputs: [
//         {
//           name: "",
//           type: "uint256",
//         },
//       ],
//       payable: false,
//       stateMutability: "view",
//       type: "function",
//     },
//     {
//       constant: true,
//       inputs: [],
//       name: "getBalance",
//       outputs: [
//         {
//           name: "",
//           type: "uint256",
//         },
//       ],
//       payable: false,
//       stateMutability: "view",
//       type: "function",
//     },
//   ],
//   "0xe9c1F3EfE4FB243b569006D22f11e541A831D038"
// );
// const tokenBalance = await contract.methods
//   .balanceOf("0xEd4033C3F684A7267E78294E51BB447430436693")
//   .call();
// console.log(contract, tokenBalance, "=======>");

// ethereum
//   .request({
//     method: "wallet_watchAsset",
//     params: {
//       type: "ERC20",
//       options: {
//         address: "0xb60e8dd61c5d32be8058bb8eb970870f07233155",
//         symbol: "FOO",
//         decimals: 18,
//         image: "https://foo.io/token-image.svg",
//       },
//     },
//   })
//   .then((success) => {
//     if (success) {
//       console.log("FOO successfully added to wallet!");
//     } else {
//       throw new Error("Something went wrong.");
//     }
//   })
//   .catch(console.error);
