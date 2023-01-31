import {contract} from "../utils/contract";
import {getAccount} from "../utils/account";

export async function addTable(numberOfTables: number): Promise<number> {
    try {
        return await contract.methods.addTable(numberOfTables).send({from: await getAccount()});
    } catch (e) {
        console.log(e);
        return -1;
    }
}

export async function changeStatusTable(id: number, isAvailable: boolean): Promise<boolean> {
    try {
        await contract.methods.changeStatusTable(id, isAvailable).send({from: await getAccount()});
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}