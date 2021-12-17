Table Reserve
==================

La idea principal de `table-reserve` es una manera de ver el mercado descentralizado en la blockchain
bajo el protocolo de Near, donde las personas puedan reservar las mesa en el restaurante de su elección antes de  
consumir cualquier producto en dicho local. Una vez terminado el consumo en el restaurante, el cliente procederá a
realizar el pago en NEARs por la aplicación, aunque si el costo por lo consumido es menor al deposito realizado durante la
reservación, el cliente no tendrá que hacer ningún pago adicional. En caso contrario, deberá depositar la diferencia restante hasta
completar el pago por el consumo.

Con Table Reserve se puede:

1. Crear Mesas (Registrar cierta cantidad de mesas de acuerdo al límite del restaurante)
2. Reservar Mesas (Por parte del cliente)
3. Cambiar el estado de la reserva
4. Mostrar las mesas disponibles
5. Mostrar las mesas reservadas para un cliente en específico
6. Asignar el costo por el consumo para cierta mesa (Por parte del restaurante)
7. Pagar por el consumo de cierta mesa (Por parte del cliente)
8. Finalizar una reservación al culminar el consumo
9. Cerrar mesas en caso de mantenimiento (Por parte del restaurante)

Instalación Local
===========

Para correr este proyecto localmente:

1. Tener instalado [Node.js] de la versión 12 en adelante
2. Instalar dependecias con:
```
yarn install 
```
3. Para correr el servidor de desarrollo local:
```
yarn dev
```
(ver `package.json` para un
listado completo de los `scripts` que puedes correr con `yarn`)
4. Crear una testnet account de NEAR --> [NEAR Wallet]
5. Instalar Near Cli de formar global:
```   
yarn install --global near-cli
```   

Clonar Table Reserve en tu equipo
================================
1. Ingresar al repositorio en Github
2. (Opcional) Dar clic en Fork para que se cree una copia en tu cuenta de GitHub
3. (Opcional) Dar clic en Code y copiar la ruta del repositorio https://
4. Ir a la ruta donde guardarás el proyecto desde la terminal de tu preferencia.
5. Ejecutar lo siguiente:
```   
git clone ruta del repositorio
```   
6. Puedes clonar directamente desde éste repositorio ejecutando:
```   
git clone https://github.com/achacin7/table-reserve.git
```  
7. Una vez clonado, ingresar a la carpeta del proyecto con el comando:
```   
cd table-reserve
```  
8. Loguearse con el usuario testnet de su cuenta de NEAR:
```   
near login
```  
9. Al hacer esto se abre el navegador para validar los datos de tu cuenta y guardar tus credenciales de NEAR

Correr el smart contract de table-reserve
==========================================
1. Una vez dentro de la ruta principal del proyecto, instalar las dependencias de [Node.JS], en este caso usamos yarn:
```   
yarn install
```
2. Ingresar a la carpeta contract/
```   
cd contract
```
3. Instalar las dependencias necesarias en contract
```   
yarn install
```
4. Volver a la ruta principal del proyecto para compilar el smartcontract
```   
cd .. 
```
5. Yá en la ruta principal del proyecto ejecutar
```
yarn build && near dev-deploy
``` 
Pruebas Unitarias 
==================
### 1.  Crear las mesas del restaurant
Las mesas se crean de acuerdo al límite establecido por el restaurante, en caso de querer extender el límite de mesas; modificar 
la constante `TABLE_LIMIT` dentro de la ruta `contract/assembly/index.ts`
```
near call  <your deployed contract> newTable '{"tableName":"Mesa 1","description":"Capacidad para 2 personas"}' --account_id=<username>.testnet
```
### 2. Lista de las mesas disponibles
Muestra todas las mesas disponible para ser reservadas por el cliente
```
near call <your deployed contract> viewTables --account_id=<username>.testnet
```
### 3. Reservar Mesa
Se puede reservar la mesa con un deposito ó reservarla sin deposito. 
En caso de reservar con deposito, este se descontará del consumo final que obtengas en el restaurant.
```
near call <your deployed contract> reserve '{"id":0}' --account_id=<username>.testnet --deposit=0.1
```
Reservar sin deposito
```
near call <your deployed contract> reserve '{"id":0}' --account_id=<username>.testnet
```
### 4. Lista de mesas reservadas por usuario
Te permite ver soló las mesas que están reservadas por el usuario de la billetera logeada. `<username>.testnet`
```
near call <your deployed contract> viewReservedById --account_id=<username>.testnet
```
### 5. Asignar costo de la comida 
Al finalizar el consumo, se agregará el costo final de lo consumido dentro de la mesa, específicamente en el campo costo de comida. 
Esto lo realizará la personas encarga del restaurante
```
near call <your deployed contract> assignFoodCost '{"id": 0, "cost": "0.1"}' --account_id=<username>.testnet
```
### 6. Pagar diferencia
Si lo consumido es mayor al costo de la reserva, se deberá pagar la diferencia
```
near call <your deployed contract> payDifference '{"id": 0}' --account_id=<username>.testnet --deposit=1.0
```
### 7. Dejar la mesa en disponible nuevamente
El usuario luego de haber cancelado la diferencia, si la hubo, podrá cambiar el estado de la mesa en disponible y ésta pasará a ser visible por los demas usuarios
```
near call <your deployed contract> closeReservation '{"id": 0}' --account_id=<username>.testnet
```
### 8. Borrar Mesas
Las mesas sólo pueden ser borradas por el personal del restaurant y las mesas deben de estar en estatus disponible, si las mesas 
están en estado reservadas la misma no pdrá ser borrada ya que está siendo reservada por un cliente.
```
near call <your deployed contract> deleteTable '{"id": 0}' --account_id=<username>.testnet

```
Test
==================
Como parte del desarrollo se tienen las pruebas, éstas evaluarán todos los métodos que posee el contracto inteligente.
### Se pueden ejecutar con el siguiente comando:
```
yarn test
```
Esto ejecutará los métodos de prueba en la siguiente ruta:
`contract/assembly/__tests__/example.spec.js`

Exploración del Proyecto
=========================
```
├── contract
│   ├── asconfig.json
│   ├── as-pect.config.js
│   ├── assembly
│   │   ├── as_types.d.ts
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── __tests__
│   │   │   ├── as-pect.d.ts
│   │   │   └── main.spec.ts
│   │   └── tsconfig.json
│   ├── build
│   │   ├── debug
│   │   │   └── greeter.wasm
│   │   └── release
│   │       └── greeter.wasm
│   ├── compile.js
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── yarn.lock
├── neardev
│   ├── dev-account
│   ├── dev-account.env
│   └── shared-test
│       ├── test-account-1639668144973-9907863.json
│       └── test-account-1639668144974-2793222.json
├── out
│   └── main.wasm
├── package.json
├── README.md
└── yarn.lock
└── Table Reserve Mockup.pdf
```
Mockup de la Dapp
=================

El Mockup se encuentra en la estructura principal del proyecto, con el nombre `Table Reserve Mockup.pdf`

  [create-near-app]: https://github.com/near/create-near-app
  [Node.js]: https://nodejs.org/en/download/package-manager/
  [jest]: https://jestjs.io/
  [NEAR accounts]: https://docs.near.org/docs/concepts/account
  [NEAR Wallet]: https://wallet.testnet.near.org/
  [near-cli]: https://github.com/near/near-cli
  [gh-pages]: https://github.com/tschaub/gh-pages
