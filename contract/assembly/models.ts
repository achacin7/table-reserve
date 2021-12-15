import {PersistentVector, context, u128} from "near-sdk-core";

/** Saving the table reservation status */

export enum status {
    available,
    reserve = 1
}

@nearBindgen
export class ReserveTable {
    id: i32
    tableName: string;
    description: string;
    status: status;
    premiumReserve: boolean;
    reservedBy: string;
    reserveCost: f64;

    /** constructor to create the tables */
    constructor(
        id: i32,
        tableName: string,
        description: string,
    ) {
        this.id = id;
        this.tableName = tableName;
        this.description = description;
        this.status = status.available;
        this.reservedBy = "Not reserved yet";
        this.reserveCost = 0;

    }

    /** method of reservation of the premium table*/
    public reserveTable(): void {
        this.status = status.reserve;
        this.reservedBy = context.sender;
        let aux = ((context.attachedDeposit.toF64())/(1e+24));
        this.reserveCost = Math.round(aux*10000)/10000;

        if(this.reserveCost >= 0.1) {
            this.premiumReserve = true;
        }
    }
}

/** saves the table information */
export let tables = new PersistentVector<ReserveTable>("tables")