import {contract} from "../utils/contract";
import {getAccount} from "../utils/account";

export enum ReservationStatus {
    Pending,
    Deposited,
    Confirmed,
    Cancelled,
    Completed
}

export enum BuffetPackage {
    Standard,
    Premium,
    Deluxe
}

export async function addReservation(
    timestampReservation: number, timestampEat: number, numberOfPeople: number,
    tablesReserved: number[], buffetPackage: BuffetPackage, useSeaFood: boolean,
    specialRequest: string): Promise<number> {
    try {
        const result = await contract.methods.addReservation(
            timestampReservation, timestampEat, numberOfPeople, tablesReserved,
            buffetPackage, useSeaFood, specialRequest
        ).send({from: await getAccount()});
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

export async function getAllReservations(account?: string): Promise<any> {
    try {
        return await contract.methods.getAllReservations(account).call({from: await getAccount()});
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

export async function depositReservation(id: number): Promise<boolean> {
    try {
        await contract.methods.depositReservation(id).send({
            from: await getAccount(),
            value: (await getReservation(id)).cost
        });
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export async function payReservation(id: number): Promise<boolean> {
    try {
        await contract.methods.payReservation(id).send({
            from: await getAccount(),
            value: (await getReservation(id)).cost
        });
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}