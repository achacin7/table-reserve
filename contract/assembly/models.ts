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
    foodCost: f64;

    // Constructor para crear mesas
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
        this.foodCost = 0;
    }

    // Método para pasar una mesa de disponible a reservada
    public reserveTable(): void {
        this.status = status.reserve;
        this.reservedBy = reserved;
        let aux = ((context.attachedDeposit.toF64()) / (1e+24));
        this.reserveCost = Math.round(aux * 10000) / 10000;

        if (this.reserveCost >= 0.1) {
            this.premiumReserve = true;
        }
    }

    // Método para cambiar una mesa de reservada a disponible
    public clearReservation(): void {
        this.status = status.available;
        this.premiumReserve = false;
        this.reservedBy = notReserved;
        this.reserveCost = 0;
        this.foodCost = 0;
    }

    // Método para asignar el costo de la comida a una mesa
    public setFoodCost(cost: f64): void{
        this.foodCost = cost;
    }

    // Método para actualizar el total de la reservación
    public updateReserveCost(): void{
        let aux = this.reserveCost;
        aux += context.attachedDeposit.toF64()/(1e+24);
        this.reserveCost = Math.round(aux * 10000) / 10000;
    }

    // Método para obtener la diferencia entre el costo de la comida y la reservación
    public getDifference(): f64 {
        let dif = Math.abs(this.foodCost - this.reserveCost);
        return Math.round(dif * 10000) / 10000;
    }
}

// Guardar las mesas en un arreglo de mesas
export let tables = new PersistentVector<ReserveTable>("tables")