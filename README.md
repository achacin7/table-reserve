Table Reserve
==================

La idea principal de `table-reserve` es una manera de ver el mercado descentralizado en la blockchain
bajo el protocolo de Near, donde las personas puedan reservar las mesa en el restaurante de su elección antes de  
consumir cualquier producto en dicho local. Una vez terminado el consumo en el restaurante, el cliente procederá a
realizar el pago en NEARs por la aplicación, aunque, si el costo por lo consumido es menor al deposito realizado durante la
reservación, el cliente no tendrá que hacer ningún pago adicional. En caso contrario, deberá depositar la diferencia restante hasta
completar el pago por el consumo.

Con Table Reserve se puede:

1. Crear Mesas (Registrar cierta cantidad de mesas de acuerdo al límite del restaurante)
2. Reservar Mesasn (Por parte del cliente)
3. Cambiar el estado de la reserva
4. Mostrar las mesas disponibles
5. Mostrar las mesas reservadas por un cliente en específico
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

Clonar TableReserve en tu equipo
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
Esto lo realizará la personas encarga del restaurant
```
near call <your deployed contract> assignFoodCost '{"id": 0, "cost": "0.1"}' --account_id=<username>.testnet
```
### 6. Pagar diferencia
Sí lo consumido es mayor al costo de la reserva se deberá pagar la diferencia
```
near call <your deployed contract> payDifference '{"id": 0}' --account_id=<username>.testnet --deposit=1.0
```
### 7. Dejar la mesa en disponible nuevamente
El usuario luego de haber cancelado la diferencia sí la hubo, podrá cambiar el estado de la mesa en disponible y está pasara a ser visibles por los demas usuarios
```
near call <your deployed contract> closeReservation '{"id": 0}' --account_id=<username>.testnet
```
### 8. Borrar Mesas
Las mesas soló pueden ser borradas por el personal del restaurant y las mesas deben de estar en estatus disponible, si las mesas 
están en estado reservadas la misma no pdrá ser borrada ya que está siendo reservada por un cliente.
```
near call <your deployed contract> deleteTable '{"id": 0}' --account_id=<username>.testnet

```
Test
==================
Como parte del desarrollo se tienen las pruebas, éstas evalurán todos los métodos que posee el contracto inteligente.
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
```

1. The "backend" code lives in the `/contract` folder. See the README there for
   more info.
2. The frontend code lives in the `/src` folder. `/src/index.html` is a great
   place to start exploring. Note that it loads in `/src/index.js`, where you
   can learn how the frontend connects to the NEAR blockchain.
3. Tests: there are different kinds of tests for the frontend and the smart
   contract. See `contract/README` for info about how it's tested. The frontend
   code gets tested with [jest]. You can run both of these at once with `yarn
   run test`.


Deploy
======

Every smart contract in NEAR has its [own associated account][NEAR accounts]. When you run `yarn dev`, your smart contract gets deployed to the live NEAR TestNet with a throwaway account. When you're ready to make it permanent, here's how.


Step 0: Install near-cli (optional)
-------------------------------------

[near-cli] is a command line interface (CLI) for interacting with the NEAR blockchain. It was installed to the local `node_modules` folder when you ran `yarn install`, but for best ergonomics you may want to install it globally:

    yarn install --global near-cli

Or, if you'd rather use the locally-installed version, you can prefix all `near` commands with `npx`

Ensure that it's installed with `near --version` (or `npx near --version`)


Step 1: Create an account for the contract
------------------------------------------

Each account on NEAR can have at most one contract deployed to it. If you've already created an account such as `your-name.testnet`, you can deploy your contract to `tableReserve.your-name.testnet`. Assuming you've already created an account on [NEAR Wallet], here's how to create `tableReserve.your-name.testnet`:

1. Authorize NEAR CLI, following the commands it gives you:

      near login

2. Create a subaccount (replace `YOUR-NAME` below with your actual account name):

      near create-account tableReserve.YOUR-NAME.testnet --masterAccount YOUR-NAME.testnet


Step 2: set contract name in code
---------------------------------

Modify the line in `src/config.js` that sets the account name of the contract. Set it to the account id you used above.

    const CONTRACT_NAME = process.env.CONTRACT_NAME || 'tableReserve.YOUR-NAME.testnet'


Step 3: deploy!
---------------

One command:

    yarn deploy

As you can see in `package.json`, this does two things:

1. builds & deploys smart contract to NEAR TestNet
2. builds & deploys frontend code to GitHub using [gh-pages]. This will only work if the project already has a repository set up on GitHub. Feel free to modify the `deploy` script in `package.json` to deploy elsewhere.


Troubleshooting
===============

On Windows, if you're seeing an error containing `EPERM` it may be related to spaces in your path. Please see [this issue](https://github.com/zkat/npx/issues/209) for more details.


  [create-near-app]: https://github.com/near/create-near-app
  [Node.js]: https://nodejs.org/en/download/package-manager/
  [jest]: https://jestjs.io/
  [NEAR accounts]: https://docs.near.org/docs/concepts/account
  [NEAR Wallet]: https://wallet.testnet.near.org/
  [near-cli]: https://github.com/near/near-cli
  [gh-pages]: https://github.com/tschaub/gh-pages
