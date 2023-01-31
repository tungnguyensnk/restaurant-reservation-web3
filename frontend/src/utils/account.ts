import {provider} from "./contract";

let account: string;

export function isMobileDevice(): boolean {
    return !!(navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        //navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i));

}

export function getLink(): string {
    const dappUrl = "192.168.1.7:8545";
    return "https://metamask.app.link/dapp/" + dappUrl;
}

export async function getAccount(): Promise<string> {
    if (!isMobileDevice() && provider) {
        account = (await provider.request({method: "eth_requestAccounts"}))[0];
        return account;
    } else {
        alert("Please install MetaMask to use this dapp.");
    }
    return "";
}

export {account};