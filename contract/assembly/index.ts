import {logging} from 'near-sdk-as';
import {tables, ReserveTable, status} from "./models";

/** The maximum number of tables the contract returns. */
const TABLE_LIMIT = 1;

export function newTable(tableName: string,
                         description: string,
): void {

  assert(tables.length <= TABLE_LIMIT, "Ya llegó al límite de mesas creadas")
  assert(tableName.length > 0, "No se pueden agregar mesas sin nombre")
  assert(description.length > 0 && description.length < 50, "Debe tener una breve descripción de al menos 50 caracteres")
  tables.push(new ReserveTable(tables.length, tableName, description));
}

export function viewTables(): Array<ReserveTable>{
  const result = new Array<ReserveTable>();
  for (let i=0; i < tables.length; i++){
    result.push(tables[i]);
  }
  return result;
}