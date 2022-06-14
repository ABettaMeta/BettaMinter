import './App.css';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { useEffect, useState } from 'react'
import 'sf-font';
import axios from 'axios';
import { NFTCONTRACT, moralisapi, nftpng } from './config';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletLink from "walletlink";
import Web3 from 'web3';

var web3 = null;
var account = null;

const moralisapikey = "2VBV4vaCLiuGu6Vu7epXKlFItGe3jSPON8WV4CrXKYaNBEazEUrf1xwHxbrIo1oM";
const providerOptions = {
	binancechainwallet: {
		package: true
	  },
	  walletconnect: {
		package: WalletConnectProvider,
		options: {
		  infuraId: "3cf2d8833a2143b795b7796087fff369"
		}
	},
	walletlink: {
		package: WalletLink, 
		options: {
		  appName: "BettaMinter", 
		  infuraId: "3cf2d8833a2143b795b7796087fff369",
		  rpc: "", 
		  chainId: 56, 
		  appLogoUrl: null, 
		  darkMode: true 
		}
	  },
};

const web3Modal = new Web3Modal({
	network: "Binance",
	theme: "dark",
	cacheProvider: true,
	providerOptions 
  });

export default function NFT() {
  const [apicall, getNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    callApi()
  }, [])

  async function callApi() {
    var provider = await web3Modal.connect();
    web3 = new Web3(provider);
    await provider.send('eth_requestAccounts');
    var accounts = await web3.eth.getAccounts();
    account = accounts[0];
		let config = {'X-API-Key': moralisapikey, 'accept': 'application/json'};
		const nfts = await axios.get((moralisapi + `/nft/${NFTCONTRACT}/owners?chain=mumbai&format=decimal`), {headers: config})
    .then(output => {
        const { result } = output.data
        return result;
      })
    const apicall = await Promise.all(nfts.map(async i => {
      let item = {
        tokenId: i.token_id,
        holder: i.owner_of,
        wallet: account,
      }
      return item
    }))
      getNfts(apicall)
      console.log(apicall);
      setLoadingState('loaded')
    } 
    if (loadingState === 'loaded' && !apicall.length) 
    return (
          <h1 className="text-3xl">Wallet Not Connected</h1>)
}
