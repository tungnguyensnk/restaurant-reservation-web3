import {contract} from "../utils/contract";
import {account} from "../utils/account";

export async function getName(): Promise<any> {
    try {
        return await contract.methods.getName().call({from: account});
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function addName(name: string): Promise<boolean> {
    try {
        await contract.methods.setName(name).send({from: account});
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}