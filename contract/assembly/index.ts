import {tables, ReserveTable} from "./models";
import {context} from "near-sdk-core";
import {logging} from "near-sdk-as";

/** The maximum number of tables the contract returns. */
const TABLE_LIMIT = 4;

export function newTable(tableName: string,
                         description: string,
): void {
    assert(tables.length < TABLE_LIMIT, "Ya llegó al límite de mesas creadas")
    assert(tableName.length > 0, "No se pueden agregar mesas sin nombre")
    assert(description.length > 0 && description.length < 50, "Debe tener una breve descripción de al menos 50 caracteres")
    tables.push(new ReserveTable(tables.length, tableName, description));
}

export function viewTables(): Array<ReserveTable> {
    const result = new Array<ReserveTable>();
    for (let i = 0; i < tables.length; i++) {
        if (!tables[i].status) {
            result.push(tables[i]);
        }
    }
    return result;
}

export function viewReservedById(): Array<ReserveTable> {
    const resultById = new Array<ReserveTable>();
    for (let i = 0; i < tables.length; i++) {
        if (tables[i].reservedBy == context.sender) {
            resultById.push(tables[i]);
        }
    }
    return resultById
}


export function reserve(id: i32): void {
    if (!tables[id].status) {
        let tableAux = tables[id];
        tableAux.reserveTable();
        tables.replace(<i32>id, tableAux);
    }
}

export function assignFoodCost(id: i32, cost: f64): void {
    for (let i = 0; i < tables.length; i++) {
        if(tables[i].id == id){
            if (tables[id].status) {
                let tableAux = tables[id];
                tableAux.setFoodCost(cost);
                tables.replace(<i32>id, tableAux);
                logging.log("Precio de la comida asignado con éxito!");
            }else{
                logging.log("Sólo se puede asignar el precio de la comida a una mesa previamente reservada!");
            }
            break;
        }
    }
}

export function closeReservation(id: i32): void {
    for (let i = 0; i < tables.length; i++) {
        if (tables[i].id == id && tables[i].status && tables[i].reservedBy == context.sender) {
            if( tables[i].foodCost > tables[i].reserveCost ){
                //Se le da un mensaje al cliente diciendo que debe pagar la diferencia para poder cerrar la reservación
                let dif = tables[i].getDifference();
                logging.log("Su depósito aún no cubre el costo total de la comida, debe completar una diferencia de: " + dif.toString());
            }else{
                //Se limpia la mesa sin problemas ya que el depósito de la reservación cubre el costo de la comida
                let aux = tables[i]
                aux.clearReservation();
                tables.replace(<i32>i, aux);
                logging.log("Reservación finalizada con éxito!");
            }
        }
    }
}

export function payDifference(id: i32): void{
    for (let i = 0; i < tables.length; i++) {
        if(tables[i].id == id && tables[i].status && tables[i].reservedBy == context.sender){

            let aux = tables[i];
            aux.updateReserveCost();
            tables.replace(<i32>i, aux);

            if(tables[i].reserveCost >= tables[i].foodCost){
                closeReservation(id);
                logging.log("Se pagó con éxito la comida!");
            }
        }
    }
}

export function closeAllReservation(): void {
    for (let i = 0; i < tables.length; i++) {
        if (tables[i].status && tables[i].reservedBy == context.sender) {
            let aux = tables[i]
            aux.clearReservation();
            tables.replace(<i32>i, aux);
        }
    }
}


export function deleteTable(id: i32): void {
    assert(id >= 0, "Introduce un id válido")
    for (let i = 0; i < tables.length; i++) {
        if (tables[i].id == id && !tables[i].status) {
            tables.swap_remove(i);
            logging.log("Mesa eliminada con éxito");
            break;
        }else if(tables[i].id == id && tables[i].status){
           logging.log("No se puede eliminar una mesa que ya está reservada");
           break;
        }
    }
}
