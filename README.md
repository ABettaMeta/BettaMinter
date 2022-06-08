BETTASEA

This repo contains all the files to implement the BETTASea Front End Design using React + CSS and Bootstrap.

** USE AT YOUR OWN RISK** **NOT RESPONSIBLE FOR ANY USE, ISSUES ETC.. **

Install Dependencies:
npm i bootstrap@5.2.0-beta1

npm i react-bootstrap

npm i sf-font

npm i web3modal

npm i @walletconnect/web3-provider

npm i walletlink

npm i web3

*Fix Webpack limitation for Web3js: https://www.youtube.com/watch?v=IHrcFo1MX60

Deploy smart contracts

Install Alchemy API module for React. Make sure you have an Alchemy account and add the info required.

npm i @alch/alchemy-web3

*Watch Alchemy EIP-1559 integration video if you need to review the steps. Use Alchemy API to transact with EIP-1559: https://www.youtube.com/watch?v=7AvKzJMQlI8

Update config.js with all your particular information:

Your Staking Smart Contract Address
Your NFT Collection Smart Contract Address
Your Polygonscan API Key
Your Moralis API Key
Your Alchemy API Key

*Replace any other information regarding the mainnet you are using accordingly. In App.js and nft.js replace infura provider ID's for web3Modal provider. Update to the mainnet you are using (if applicable).

Start server "npm run start"
