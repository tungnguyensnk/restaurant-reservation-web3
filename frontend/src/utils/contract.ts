import Web3 from 'web3';

const {ABI} = require('../contracts/contract-abi');
const {ADDRESS} = require('../contracts/contract-address');

const web3 = new Web3("ws://127.0.0.1:8545");
const contract = new web3.eth.Contract(ABI, ADDRESS);

export {contract, web3};