import './App.css';
import { Button, ButtonGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import 'sf-font';
import axios from 'axios';
import ABI from './ABI.json';
import TOKENABI from './TOKENABI.json';
import { NFTCONTRACT, bscscanapi, moralisapi, nftpng } from './config';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletLink from "walletlink";
import Web3 from 'web3';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';

var account = null;
var contract = null;
var web3 = null;

const Web3Alc = createAlchemyWeb3("https://eth-rinkeby.alchemyapi.io/v2/8AX5AP2TU6G45ctsOXNt8K4Fz_BkhhZG");

const moralisapikey = "2VBV4vaCLiuGu6Vu7epXKlFItGe3jSPON8WV4CrXKYaNBEazEUrf1xwHxbrIo1oM";
const bscscanapikey = "DBQX5JUSAVUZRK8CC4IN2UZF9N2HA63P4U";

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
		  appName: "Net2Dev NFT Minter", 
		  infuraId: "3cf2d8833a2143b795b7796087fff369",
		  rpc: "", 
		  chainId: 4, 
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

class App extends Component {
	constructor() {
		super();
		this.state = {
			balance: [],
			rawearn: [],
		};
	}
  
	handleModal(){  
		this.setState({show:!this.state.show})  
	} 

	handleNFT(nftamount) {
		this.setState({outvalue:nftamount.target.value});
  	}

	async componentDidMount() {
		
		await axios.get((bscscanapi + `?module=stats&action=tokensupply&contractaddress=${NFTCONTRACT}&apikey=${bscscanapikey}`))
		.then(outputa => {
            this.setState({
                balance:outputa.data
            })
            console.log(outputa.data)
        })
		let config = {'X-API-Key': moralisapikey, 'accept': 'application/json'};
		await axios.get((moralisapi + `/nft/${NFTCONTRACT}/owners?chain=mumbai&format=decimal`), {headers: config})
		.then(outputb => {
			const { result } = outputb.data
            this.setState({
                nftdata:result
            })
            console.log(outputb.data)
        })
	}


render() {
	const {balance} = this.state;
	const {outvalue} = this.state;
  

  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  const expectedBlockTime = 10000;

  async function connectwallet() {
    var provider = await web3Modal.connect();
    web3 = new Web3(provider);
    await provider.send('eth_requestAccounts');
    var accounts = await web3.eth.getAccounts();
    account = accounts[0];
    document.getElementById('wallet-address').textContent = account;
    contract = new web3.eth.Contract(ABI, NFTCONTRACT);
   }
    function delay() {
      return new Promise(resolve => setTimeout(resolve, 300));
    }
    async function delayedLog(item) {
      await delay();
      var sum = item.reduce((a, b) => a + b, 0);
      var formatsum = Number(sum).toFixed(2);
      document.getElementById('earned').textContent = formatsum;
    }
    async function processArray(rwdArray) {
      for (const item of rwdArray) {
        await delayedLog(item);
      }
    }
    return processArray([rwdArray]);
  }

  }
    async function delayedLog(item) {
      await delay();
      var sum = item.reduce((a, b) => a + b, 0);
      var formatsum = Number(sum).toFixed(2);
      document.getElementById('earned').textContent = formatsum;
    }
    async function processArray(rwdArray) {
      for (const item of rwdArray) {
        await delayedLog(item);
      }
    }
    return processArray([rwdArray]);
  }
  async function claimit() {
    var rawnfts = await vaultcontract.methods.tokensOfOwner(account).call();
    const arraynft = Array.from(rawnfts.map(Number));
    const tokenid = arraynft.filter(Number);
    await Web3Alc.eth.getMaxPriorityFeePerGas().then((tip) => {
      Web3Alc.eth.getBlock('pending').then((block) => {
        var baseFee = Number(block.baseFeePerGas);
        var maxPriority = Number(tip);
        var maxFee = maxPriority + baseFee;
        tokenid.forEach(async (id) => {
          await vaultcontract.methods.claim([id])
            .send({
              from: account,
              maxFeePerGas: maxFee,
              maxPriorityFeePerGas: maxPriority
            })
        })
      });
    })
  }
  async function mintnative() {
    var _mintAmount = Number(outvalue);
    var mintRate = Number(await contract.methods.cost().call());
    var totalAmount = mintRate * _mintAmount;
    await Web3Alc.eth.getMaxPriorityFeePerGas().then((tip) => {
        Web3Alc.eth.getBlock('pending').then((block) => {
            var baseFee = Number(block.baseFeePerGas);
            var maxPriority = Number(tip);
            var maxFee = baseFee + maxPriority
        contract.methods.mint(account, _mintAmount)
            .send({ from: account,
              value: String(totalAmount),
              maxFeePerGas: maxFee,
              maxPriorityFeePerGas: maxPriority});
        });
    })
  }

  async function mint0() {
    var _pid = "0";
    var erc20address = await contract.methods.getCryptotoken(_pid).call();
    var currency = new web3.eth.Contract(TOKENABI, erc20address);
    var mintRate = await contract.methods.getNFTCost(_pid).call();
    var _mintAmount = Number(outvalue);
    var totalAmount = mintRate * _mintAmount;
    await Web3Alc.eth.getMaxPriorityFeePerGas().then((tip) => {
      Web3Alc.eth.getBlock('pending').then((block) => {
        var baseFee = Number(block.baseFeePerGas);
        var maxPriority = Number(tip);
        var maxFee = maxPriority + baseFee;
        currency.methods.approve(NFTCONTRACT, String(totalAmount))
					  .send({
						  from: account})
              .then(currency.methods.transfer(NFTCONTRACT, String(totalAmount))
						  .send({
							  from: account,
							  maxFeePerGas: maxFee,
							  maxPriorityFeePerGas: maxPriority
						  },
              async function (error, transactionHash) {
                console.log("Transfer Submitted, Hash: ", transactionHash)
                let transactionReceipt = null
                while (transactionReceipt == null) {
                  transactionReceipt = await web3.eth.getTransactionReceipt(transactionHash);
                  await sleep(expectedBlockTime)
                }
                window.console = {
                  log: function (str) {
                    var out = document.createElement("div");
                    out.appendChild(document.createTextNode(str));
                    document.getElementById("txout").appendChild(out);
                  }
                }
                console.log("Transfer Complete", transactionReceipt);
                contract.methods.mintpid(account, _mintAmount, _pid)
                .send({
                  from: account,
                  maxFeePerGas: maxFee,
                  maxPriorityFeePerGas: maxPriority
                });
            }));
    });
  });
}
const refreshPage = ()=>{
  window.location.reload();  
}

  return (
    <div className="App nftapp">
        <nav class="navbar navbarfont navbarglow navbar-expand-md navbar-dark bg-dark mb-4">
          <div class="container-fluid" style={{ fontFamily: "SF Pro Display" }}>
            <a class="navbar-brand px-5" style={{ fontWeight: "800", fontSize: '25px' }} href="#"></a><img src="n2d-logo.png" width="7%" />
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
              <ul class="navbar-nav me-auto mb-2 px-3 mb-md-0" style={{ fontSize: "25px" }}>
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="#">Dashboard</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">List NFTs</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link">Bridge NFTs</a>
                </li>
              </ul>
            </div>
          </div>
          <div className='px-5'>
            <input id="connectbtn" type="button" className="connectbutton" onClick={connectwallet} style={{ fontFamily: "SF Pro Display" }} value="Connect Your Wallet" />
          </div>
        </nav>
        <div className='container container-style'>
          <div className='col'>
            <body className='nftminter'>
          <form>
            <div className="row pt-3">
              <div>
                <h1 className="pt-2" style={{ fontWeight: "30" }}>NFT Minter</h1>
              </div>
              <h3>{balance.result}/1000</h3>
              <h6>Your Wallet Address</h6>
              <div className="pb-3" id='wallet-address' style={{
                color: "#39FF14",
                fontWeight: "400",
                textShadow: "1px 1px 1px black",
              }}>
                <label for="floatingInput">Please Connect Wallet</label>
              </div>
            </div>
            <div>
              <label style={{ fontWeight: "300", fontSize: "18px" }}>Select NFT Quantity</label>
            </div>
            <ButtonGroup size="lg"
              aria-label="First group"
              name="amount"
              style={{ boxShadow: "1px 1px 5px #000000" }}
              onClick={nftamount => this.handleNFT(nftamount, "value")}
            >
              <Button value="1">1</Button>
              <Button value="2">2</Button>
              <Button value="3">3</Button>
              <Button value="4">4</Button>
              <Button value="5">5</Button>
            </ButtonGroup>
            <h6 className="pt-2" style={{ fontFamily: "SF Pro Display", fontWeight: "300", fontSize: "18px" }}>Buy with your preferred crypto!</h6>
            <div className="row px-2 pb-2 row-style">
              <div className="col ">
                <Button className="button-style" onClick={mint0} style={{ border: "0.2px", borderRadius: "14px", boxShadow: "1px 1px 5px #000000" }}>
                  <img src={"n2dr-logo.png"} width="100%" />
                </Button>
              </div>
              <div className="col">
                <Button className="button-style" style={{ border: "0.2px", borderRadius: "14px", boxShadow: "1px 1px 5px #000000" }}>
                  <img src="usdt.png" width="70%" />
                </Button>
              </div>
              <div className="col">
                <Button className="button-style" onClick={mintnative} style={{ border: "0.2px", borderRadius: "14px", boxShadow: "1px 1px 5px #000000" }}>
                  <img src="matic.png" width="70%" />
                </Button>
              </div>
              <div>
                <label id='txout' style={{ color: "#39FF14", marginTop: "5px", fontSize: '20px', fontWeight: '500', textShadow: "1px 1px 2px #000000" }}>
                  <p style={{ fontSize: "20px" }}>Transfer Status</p>
                </label>
              </div>
            </div>
          </form>
          </body>
          </div>
                    </div>
                  </div>
                </div>
            </form>
          </body>
        </div>
      </div>
      <div className='row nftportal mt-3'>
        <div className='col mt-4 ml-3'>
        <img src="polygon.png" width={'60%'}></img>
      </div>
      <div className='col'>
        <h1 className='n2dtitlestyle mt-3'>Your NFT Portal</h1>
      <Button onClick={refreshPage} style={{ backgroundColor: "#000000", boxShadow: "1px 1px 5px #000000" }}>Refresh NFT Portal</Button>
      </div>
      <div className='col mt-3 mr-5'>
      <img src="ethereum.png" width={'60%'}></img>
      </div>
      </div>
      </div>
    )
  }
}
export default App;
