import {PersistentVector, context} from "near-sdk-core";

/** Saving the table reservation status */

export enum status {
    available,
    reserve = 1
}

const notReserved: string = "Not reserved yet";
const reserved: string = context.sender;

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
        this.reservedBy = notReserved;
        this.reserveCost = 0;

    }

    /** method of reservation of the premium table*/
    public reserveTable(): void {
        this.status = status.reserve;
        this.reservedBy = reserved;
        let aux = ((context.attachedDeposit.toF64()) / (1e+24));
        this.reserveCost = Math.round(aux * 10000) / 10000;

        if (this.reserveCost >= 0.1) {
            this.premiumReserve = true;
        }
    }

    public clearReservation(): void {
        this.status = status.available;
        this.premiumReserve = false;
        this.reservedBy = notReserved;
        this.reserveCost = 0;
    }
}

/** saves the table information */
export let tables = new PersistentVector<ReserveTable>("tables")