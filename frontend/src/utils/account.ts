import {web3} from "./contract";

export async function getAccount(): Promise<string> {
    return (await web3.eth.getAccounts())[0];
}