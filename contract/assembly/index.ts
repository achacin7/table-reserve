import {tables, ReserveTable} from "./models";
import {context} from "near-sdk-core";
import { logging } from "near-sdk-as";

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
        if(!tables[i].status){
            result.push(tables[i]);
        }
    }
    return result;
}

export function viewReservedById(): Array<ReserveTable>{
    logging.log(context.sender);
    const resultById = new Array<ReserveTable>();
    for (let i = 0; i < tables.length; i++) {
        if(tables[i].reservedBy == context.sender){
            resultById.push(tables[i]);
        }
    }
    return resultById
}


export function reserve(id: i32): void {
    if (!tables[id].status) {
            let tableAux = tables[id];
            tableAux.reserveTable()
            tables.replace(<i32>id, tableAux);
    }
}


export function deleteReservation(id: i32
): void {
    assert(id >= 0, "Introduce un id válido")
    for (let i = 0; i < tables.length; i++) {
        if (tables[i].id == id) {
            tables.swap_remove(i)
        }
    }
}
