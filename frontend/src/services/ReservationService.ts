import {contract} from "../utils/contract";
import {getAccount} from "../utils/account";

export enum ReservationStatus {
    Pending,
    Paid,
    Confirmed,
    Cancelled,
    Completed
}
export async function addReservation(
    timestampReservation: number, timestampEat: number, numberOfPeople: number, tablesReserved: number[],
    listItems: { id: number, quantity: number }[], specialRequest: string
): Promise<number> {
    try {
        const result = await contract.methods.addReservation(timestampReservation, timestampEat,
            numberOfPeople, tablesReserved, listItems, specialRequest).send({from: await getAccount()});
        return result.events.ReservationAdded.returnValues.reservationId;
    } catch (e) {
        console.log(e);
        return -1;
    }
}

export async function cancelReservation(id: number): Promise<boolean> {
    try {
        await contract.methods.cancelReservation(id).send({from: await getAccount()});
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export async function getReservation(id: number): Promise<any> {
    try {
        return await contract.methods.getReservation(id).call({from: await getAccount()});
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function getAllReservations(): Promise<any> {
    try {
        return await contract.methods.getAllReservations().call({from: await getAccount()});
    } catch (e) {
        console.log(e);
        return null;
    }
}

// function getAllReservationsOfCustomer(address _customer)
export async function getAllReservationsOfCustomer(account: string): Promise<any> {
    try {
        return await contract.methods.getAllReservationsOfCustomer(account).call({from: await getAccount()});
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function changeStatusReservation(id: number, status: ReservationStatus): Promise<boolean> {
    try {
        await contract.methods.changeStatusReservation(id, status).send({from: await getAccount()});
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export async function payReservation(id: number): Promise<boolean> {
    try {
        await contract.methods.payReservation(id).send({from: await getAccount(), value: 1000000000000000000});
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}