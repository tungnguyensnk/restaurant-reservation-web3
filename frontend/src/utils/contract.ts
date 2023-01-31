import Web3 from 'web3';

const {ABI} = require('../contracts/contract-abi');
const {ADDRESS} = require('../contracts/contract-address');

// @ts-ignore
const provider = window.ethereum;
const web3 = new Web3(provider);
const contract = new web3.eth.Contract(ABI, ADDRESS);

export {contract, web3, provider};