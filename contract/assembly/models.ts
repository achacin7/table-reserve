import { PersistentVector, context, u128 } from "near-sdk-core";

/** Saving the table reservation status */

export enum status {
    available,
    reserve = 1
}

@nearBindgen
export class ReserveTable {
    id:u64
    tableName:string;
    description:string;
    status:status;
    premiumReserve:boolean;
    reserveName: string;
    costReserve: u128;
    /** constructor to create the tables */
    constructor(
        id:u64,
        tableName: string,
        description:string,
    ) {
        this.id = id;
        this.tableName = tableName;
        this.description = description;
        this.status = status.available;
    }
    /** method of reservation of the premium table*/
    /*public reserveTable(
        premiumReserve:boolean,
    ){
        this.premiumReserve = premiumReserve;
        this.reserveName = context.sender;
        this.costReserve = context.attachedDeposit;
    }*/
}

/** saves the table information */
export let tables = new PersistentVector<ReserveTable>("tables")