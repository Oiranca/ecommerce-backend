# ecommerce-backend

1. [Dependencias](#dependencias)
2. [Instalación e incialización](#instalacion)
3. [Descripción](#descripcion)
4. [Futuras feature](#feature)

<div id='dependencias'/>

## **Dependencias**


>     "@babel/core": "^7.12.9",
>     "@babel/node": "^7.12.6",
>     "@babel/preset-env": "^7.12.7",
>     "dotenv": "^8.2.0",
>     "eslint": "^7.15.0",
>     "express": "^4.17.1",
>     "jest": "^26.6.3",
>     "nodemon": "^2.0.6",
>     "prettier": "2.2.1"
>     "bcrypt": "^5.0.0",
>     "body-parser": "^1.19.0",
>     "jsonwebtoken": "^8.5.1",
>     "mongoose": "^5.11.7"

<div id='instalacion'/>

## **Instalación e incialización**

* Para instalar las dependencias:

> npm install



* Para ejecutar:

> npm start
<div id='descripcion'/>

## **Descripción**

Es un backend realizado con Nodejs y Express en donde simulamos una tienda donde podremmos comprar tanto de menera Online y luego ir a recoger a la tienda como, de manera presencial.

Podremos registarnos como *clientes, admininistradores y los administradores podrán crear empleados*

Tenemos tres tipos de roles:

* **Admin**: Con este rol, podremos gestionar todo lo que conlleve la tienda, además del rol necesario para dar de alta a los 'Empleados'. 

* **Employee**: Con este tipo de rol, podemos gestionar : 

    * Productos: Crear, modificar, eliminar y buscar.
    * Factura: Crear,modificar y buscar.

* **Client**: Este tipo de rol solamente podrá realizar compras y ver las facturas que tiene con nosotros.

* Provider: Este tipo de rol, es solamente para crear los productos.

#### Tecnologías a usar

* Nodejs
* Express
* Mongoose
* Git
* Git-flow
* Mirar babel para poder trabajar con ES6

### Requisitos mínimos

 * Validación por Token (JWT)
 * Endpoint Login
 * Endpoint Registro
 * Endpoint Perfir (datos usuario)
 * Endpoint modificar datos usuario
 * Endpoints Crud stock
 * Endpoint list stock
 * Endpoint busqueda con filtros (mas vendidos,precio,título)
 * Endpoint filtrar productos por vendedor
 * Endpoint productos por categorias
 * Endpoint añadir compras
 * Enpoint muestra todas las compras
 * Endpoint compra por usuarios
 * Enpoint modificación datos factura (solo el vendedor/administrador)
 * Roles (Administrado/Vendedor/Usuario)

### Estructura de collecciones en Mongoose:

* **Admins**

```
 {
        name: { type: String, required: true },
        surnames: { type: String, required: true },
        password: { type: String, required: true },
        identification: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        phone: { type: Number, required: true, unique: true },
        role: { type: String, required: true },
        address: {
            type: {
                street: { type: String, required: true },
                numberStreet: { type: Number, required: true },
                level: { type: String, required: false },
                postalCode: { type: Number, required: true },
            },
        },
        emailIsConfirmed: { type: Boolean, required: true, default: false },
    },
    { collection: 'admins' },
```

* **Employee**

```
 {
        name: { type: String, required: true },
        surnames: { type: String, required: true },
        password: { type: String, required: true },
        identification: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        phone: { type: Number, required: true, unique: true },
        role: { type: String, required: true },
        address: {
            type: {
                street: { type: String, required: true },
                numberStreet: { type: Number, required: true },
                level: { type: String, required: false },
                postalCode: { type: Number, required: true },
            },
        },
        emailIsConfirmed: { type: Boolean, required: true, default: false },
    },
    { collection: 'admins' },
```

* **Client**

```
{
        name: { type: String, required: true },
        surnames: { type: String, required: true },
        password: { type: String, required: true },
        identification: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        phone: { type: Number, required: true, unique: true },
        role: { type: String, required: true },
        address: {
            type: {
                street: { type: String, required: true },
                numberStreet: { type: Number, required: true },
                level: { type: String, required: false },
                postalCode: { type: Number, required: true },
            },
        },
        emailIsConfirmed: { type: Boolean, required: true, default: false },
    },
    { collection: 'client' }
```

* **Provider**

```
{
    nameProvider: { type: String, required: true },
    role: { type: String, required: true, default: roles.provider },
    identification: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, unique: true },
    address: {
        street: { type: String, required: true },
        numberStreet: { type: Number, required: true },
        level: { type: String, required: false },
        postalCode: { type: Number, required: true },
    },
    emailIsConfirmed: { type: Boolean, required: true, default: false },
}
```

* **Basket**

```
{
    id_client: { type: String, required: true },
    id_employee: { type: String, required: true },
    basket_products: {
        type: [
            {
                id_product: { type: String, required: true },
                product_name: { type: String, required: true },

                quantity: { type: Number, required: true },
                pvp: { type: Number, required: true },
            },
        ],
        required: true,
    },
    total: { type: Number, required: true, default: 0 },
}
```
* **Bills**

```
{
    id_employee: { type: String, required: true },
    id_employeeUpdate: { type: String, required: true },
    products: {
        type: [
            {
                id_product: { type: String, required: true },
                product_name: { type: String, required: true },
                quantity: { type: Number, required: true },
                pvp: { type: Number, required: true },
            },
        ],
        required: true,
    },
    id_client: { type: String, required: true },
    client_address: {
        type: {
            street: { type: String, required: true },
            numberStreet: { type: Number, required: true },
            level: { type: String, required: false },
            postalCode: { type: Number, required: true },
        },
    },
    client_identification: { type: String, required: true },
    bill_number: { type: Number, required: true },
    bill_state: { type: Boolean, required: true, default: true },
    date: { type: String, required: true },
    date_update: { type: String, required: true },
    tax: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
}
```

* **Store**

```
{
    id_provider: { type: String, required: true },
    product_name: { type: String, required: true },
    ean: { type: Number, required: true },
    pvd: { type: Number, required: true },
    category: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
}
```

<div id="feature"/>

## Futuras features

* Si el correo existe como cliente no podrá existir dentro de la compañía.

* Eliminar de **basket** cuando se crea una **bills**.

* Eliminar de la **store** cuando se crea un **basket**.
