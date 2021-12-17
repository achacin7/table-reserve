import {tables, ReserveTable} from "./models";
import {context} from "near-sdk-core";
import {logging} from "near-sdk-as";

/** The maximum number of tables the contract returns. */
export const TABLE_LIMIT = 4;

// Método para crear mesas
export function newTable(tableName: string,
                         description: string,
): void {
    assert(tables.length < TABLE_LIMIT, "Ya llegó al límite de mesas creadas")
    assert(tableName.length > 0, "No se pueden agregar mesas sin nombre")
    assert(description.length > 0 && description.length < 50, "Debe tener una breve descripción de al menos 50 caracteres")
    tables.push(new ReserveTable(tables.length, tableName, description));
}

// Método para ver mesas disponibles
export function viewTables(): Array<ReserveTable> {
    const result = new Array<ReserveTable>();
    for (let i = 0; i < tables.length; i++) {
        if (!tables[i].status) {
            result.push(tables[i]);
        }
    }
    return result;
}

// Método para ver mesas reservadas por un cliente en específico
export function viewReservedById(): Array<ReserveTable> {
    const resultById = new Array<ReserveTable>();
    for (let i = 0; i < tables.length; i++) {
        if (tables[i].reservedBy == context.sender) {
            resultById.push(tables[i]);
        }
    }
    return resultById
}

// Método para reservar mesas (Por parte del cliente)
export function reserve(id: i32): void {
    for (let i = 0; i < tables.length; i++) {
        if(tables[i].id == id){
            if (!tables[i].status) {
                let tableAux = tables[i];
                tableAux.reserveTable();
                tables.replace(<i32>i, tableAux);
            }
        }
    }
}

// Método para asignar el costo de la comida en una mesa (Por parte del restaurante)
export function assignFoodCost(id: i32, cost: string): void {
    for (let i = 0; i < tables.length; i++) {
        if(tables[i].id == id){
            if (tables[id].status) {
                let tableAux = tables[id];
                tableAux.setFoodCost(parseFloat(cost));
                tables.replace(<i32>id, tableAux);
                logging.log("Precio de la comida asignado con éxito!");
            }else{
                logging.log("Sólo se puede asignar el precio de la comida a una mesa previamente reservada!");
            }
            break;
        }
    }
}

// Método para cerrar una reservación (Por parte del cliente) 
export function closeReservation(id: i32): void {
    for (let i = 0; i < tables.length; i++) {
        if (tables[i].id == id && tables[i].status && tables[i].reservedBy == context.sender) {
            if( tables[i].foodCost > tables[i].reserveCost ){
                //Se le da un mensaje al cliente diciendo que debe pagar la diferencia para poder cerrar la reservación
                showDifference(tables[i]);
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

// Método para pagar la diferencia en caso de que el costo de la comida supere el deposito de la reservación
// (Por parte del cliente)
export function payDifference(id: i32): void{
    for (let i = 0; i < tables.length; i++) {
        if(tables[i].id == id && tables[i].status && tables[i].reservedBy == context.sender){

            let aux = tables[i];
            aux.updateReserveCost();
            tables.replace(<i32>i, aux);

            if(tables[i].reserveCost >= tables[i].foodCost){
                closeReservation(id);
                logging.log("Se pagó con éxito la comida!");
            }else{
                showDifference(tables[i]);
            }
        }
    }
}

// Método para dar de baja una mesa (Por parte del reataurante)
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

// Método para mostrar la diferencia entre el costo de la comida y el deposito de la reservación
export function showDifference( table: ReserveTable ): void {
    let dif = table.getDifference();
    logging.log("Su depósito aún no cubre el costo total de la comida, debe completar una diferencia de: " + dif.toString());
}