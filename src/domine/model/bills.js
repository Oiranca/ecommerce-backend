/*
### Impuestos

| Nombre Atributo |  Tipo   | Obligatoriedad                               |
|:---------------:|:-------:| -------------------------------------------- |
|       Id        | Mongodb | No puede ser null/undefined y debe ser único |
|     Nombre      | String  | No puede ser null/undefined y debe ser único |
|      Valor      | Number  | No puede ser null/undefined                  |


### Factura_Ventas

|   Nombre Atributo    |  Tipo   |                                Obligatoriedad                                 |
|:--------------------:|:-------:|:-----------------------------------------------------------------------------:|
|          Id          | Mongodb |                 No puede ser null/undefined y debe ser único                  |
|     Id_Vendedor      | String  | No puede ser null/undefined sólo puede facturar el adminitrador o el vendedor |
|    Id_Modificador    | String  |   No puede ser null/undefined se guarda el último que la modifico o realizó   |
|     Id_Producto      | String  |                          No puede ser null/undefined                          |
|      Id_Cliente      | String  |                          No puede ser null/undefined                          |
|    Número_Factura    | Number  |           No puede ser null/undefined debe ser correlativo y único            |
|    Estado_Factura    | Boolean |              No puede ser null/undefined (Devuelta o Nodevuelta)              |
|        Fecha         |  Date   |                          No puede ser null/undefined                          |
|  Unidades_Vendidas   | Number  |                          No puede ser null/undefined                          |
|  Impuesto_Aplicado   | String  |                          No puede ser null/undefined                          |
|     Precio_Venta     | Number  |                          No puede ser null/undefined                          |
|      Descuento       | Boolean |                           Puede ser null/undefined                            |
| Porcentaje_Descuento | Number  |                           Puede ser null/undefined                            |
* */
import { Schema, model } from 'mongoose';

const billsModel = new Schema({
    id_employee: { type: String, required: true },
    id_employeeUpdate: { type: String, required: true },
    products: {
        type: [
            {
                id_product: { type: String, required: true },
                quantity: { type: Number, required: true },
                pvp: { type: Number, required: true },
            },
        ],
        required: true,
    },
    id_client: { type: String, required: true },
    bill_number: { type: Number, required: true },
    bill_state: { type: Boolean, required: true, default: true },
    date: { type: String, required: true },
    date_update: { type: String, required: true },
    tax: { type: Number, required: true },
    pvp: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
});

export default model('Bills', billsModel);
