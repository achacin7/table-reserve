import * as contract from "../index";
import {tables, ReserveTable} from "../models";
import {TABLE_LIMIT} from "../index";
import {VMContext, u128, logging} from 'near-sdk-as';


/** Test para evaluar el método crear mesas */

describe('Crear Mesa', () => {
    it("Debería de crear una mesa", () => {
        expect(() => {
            contract.newTable("Mesa 1", "Capacidad para 5 personas");
        }).not.toThrow();
    })
    it("Debería de fallar si la mesa no tiene nombre", () => {
        expect(() => {
            contract.newTable("", "Capacidad para 5 personas");
        }).toThrow();
    })
    it("Debería de fallar si la mesa no tiene descripción", () => {
        expect(() => {
            contract.newTable("Mesa 1", "");
        }).toThrow();
    })
});

/** Test para evaluar ver mesa creada */

describe('Ver mesas disponibles', () => {
    it("Ver Mesa 1", () => {
        contract.newTable("Mesa 1", "Capacidad para 5 personas");
        expect(contract.viewTables()[0].tableName).toStrictEqual(
            "Mesa 1",
            "Debería mostrar el nombre de la mesa 1");
    })
});

/** Test para evaluar el límite de mesas */

describe('Evaluando límite de mesas', () => {
    it("No debería de crear mas mesas una vez alcanzado el límite", () => {
        for (let i = 0; i < TABLE_LIMIT; i++) {
            contract.newTable("Mesa " + i.toString(), "Capacidad para 5 personas");
        }
        expect(() => {
            contract.newTable("Mesa 4", "Capacidad para 5 personas");
        }).toThrow();
        expect(contract.viewTables().length).toStrictEqual(TABLE_LIMIT, "Debería ser igual al límite que es " + TABLE_LIMIT.toString());
    })
});

/** Test para evaluar las mesas asignadas; la asignación del costo de la comida y verificación de la misma; eliminar mesas disponibles
 y validar que no se pueda eliminar mesas asignadas; validar el costo de la reservación; cerrar reservación*/

describe('Evaluar mesas asignadas', () => {
    it("Reservación de mesas y asignación del costo de la comida", () => {

        for (let i = 0; i < 4; i++) {
            contract.newTable("Mesa " + i.toString(), "Capacidad para 5 personas");
        }

        // Reservando mesa y depositando reservación de 0.2 Near
        expect(() => {
            // El valor del deposito esta expresado en yoctoNEAR
            VMContext.setAttached_deposit(u128.from('200000000000000000000000'));
            contract.reserve(0);
        }).not.toThrow();

        // Verificando la mesa reservada
        expect(tables[0].status).toStrictEqual(1, "Debería mostrar status 1 ya que fue reservada");

        // Verificando el costo de la reservación
        expect(tables[0].reserveCost).toStrictEqual(0.2, "Debería mostrar el costo de 0.2 depositado");

        // Ingresando costo de comida
        expect(() => {
            contract.assignFoodCost(0, "0.1")
        }).not.toThrow();

        // Verificación del costo de la comida
        expect(tables[0].foodCost).toStrictEqual(0.1, "Debería tener el costo asignado para la comida de 0.1");

        // Verificar que no se puedan borrar mesas asignadas
        expect(() => {
            contract.deleteTable(0);
        }).not.toThrow();
        expect(tables[0].id).toStrictEqual(0, "Se espera que exista la mesa y que el id sea el mismo que se intentó eliminar");

        // Cerrar reservación
        expect(() => {
            contract.closeReservation(0);
        }).not.toThrow();
        expect(tables[0].status).toStrictEqual(0, "Debería mostrar status 0 ya que fue cerrada la reservación y la mesa está disponible");
        expect(tables[0].reserveCost).toStrictEqual(0, "Debería mostrar el costo de la reservación en cero ya que el cliente dejó la mesa disponible");
        expect(tables[0].foodCost).toStrictEqual(0, "Debería mostrar el costo de la comida en cero ya que el cliente pagó el saldo pendiente por el costo de la comida");

        // Verificación para eliminar una mesa ya que estará en mantenimiento
        expect(() => {
            contract.deleteTable(3);
        }).not.toThrow();
        expect(tables[tables.length - 1].id).toBeLessThan(3, "Se espera que no se encuentre la mesa eliminada y por ende tampoco su id, así que la última mesa no tendrá id 3");
    })
});

/** Pagar la diferencia del costo de la comida respecto al costo de la reservación de la mesa */

describe('Evaluando el pago de la diferencia', () => {
    it("Pagar diferencia del costo de la comida", () => {

        expect(() => {
            contract.newTable("Mesa 1", "Capacidad para 5 personas");
            VMContext.setAttached_deposit(u128.from('100000000000000000000000'));
            contract.reserve(0);
            contract.assignFoodCost(0, "0.2")
        }).not.toThrow();

        expect(tables[0].getDifference()).toStrictEqual(0.1, "El cliente debería pagar una diferencia de 0.1 ya que el costo de la comida supera en es cantidad el costo de la reservación");

        expect(() => {
            VMContext.setAttached_deposit(u128.from('100000000000000000000000'));
            contract.payDifference(0);
        }).not.toThrow();

        expect(tables[0].getDifference()).toStrictEqual(0, "La diferencia deberia ser 0 ya que el cliente pagó su deuda");
        expect(tables[0].status).toStrictEqual(0, "El estatus debería estar en cero ya que el cliente cerró la reservación al pagar");
        expect(tables[0].reserveCost).toStrictEqual(0, "Al estar disponible nuevamente la mesa, no hay asignado costo de reservación");
        expect(tables[0].foodCost).toStrictEqual(0, "Debido a que la mesa está disponible, no tiene costo la comida");
    })
});







