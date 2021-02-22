import Basket from '../../../domine/model/basket';
import Admins from '../../../domine/model/admins';
import Employee from '../../../domine/model/employee';
import Users from '../../../domine/model/users';
import Product from '../../../domine/model/products';
import roles from '../../../domine/model/roles';
import jwt from 'jsonwebtoken';
import taxes from '../../../domine/model/tax';

const productsSold = async (basket_products) => {
    const totalProducts = [];
    let idRepProduct = [];

    basket_products.map((items) => {
        const filter = basket_products.filter(
            (itemsToFind) => itemsToFind.id_product === items.id_product,
        );
        filter.map((itemsToFilter) => {
            const elementToFind = (element) =>
                element.id_product === itemsToFilter.id_product;
            const findIndexElement = totalProducts.findIndex(elementToFind);
            if (findIndexElement === -1) {
            }
        });
        // if (idRepProduct === items.id_product) {
        //     const elementToFind = (element) => element.id_product === items.id_product;
        //     const findIndexElement = totalProducts.findIndex(elementToFind);
        //     totalProducts[findIndexElement].pvp =
        //         totalProducts[findIndexElement].pvp + items.pvp * items.quantity;
        //     totalProducts[findIndexElement].quantity =
        //         totalProducts[findIndexElement].quantity + items.quantity;
        // } else {
        // totalProducts.push({
        //     id_product: items.id_product,
        //     quantity: items.quantity,
        //     pvp: items.pvp * items.quantity,
        // });
        //     idRepProduct = items.id_product;
        // }
        //
        // if (!idRepProduct.includes(items.id_product)) {
        //     idRepProduct.push(items.id_product);
        //     const filter = basket_products.filter(
        //         (itemsToFind) => itemsToFind.id_product === items.id_product,
        //     );
        //     totalProducts.push({
        //         id_product: items.id_product,
        //     });
        //     console.log(filter);
        // }
        // //
        // const filter = basket_products.filter(
        //     (itemsToFind) => itemsToFind.id_product === items.id_product,
        // );
        // const a = filter.map((b) => {
        //     // if (!!totalProducts.includes(b.id_product)) {
        //     //     totalProducts.push({ id: b.id_product });
        //     // }
        //     console.log(totalProducts.includes(b.id_product));
        // });
    });

    // console.log(totalProducts);
};

const createBills = async (req, res) => {
    try {
        let userCredential;

        const tokenUser = req.headers['token-users'];

        const { email, role } = jwt.verify(tokenUser, process.env.SECRET_TOKEN);
        req.session = {
            email,
            role,
        };

        switch (role) {
            case roles.admin:
                userCredential = await Admins.findOne({
                    email: req.session.email,
                }).select({ _id: 1 });

                break;
            case roles.employee:
                userCredential = await Employee.findOne({
                    email: req.session.email,
                }).select({ _id: 1 });
        }

        const consultsBasket = await Basket.findOne({
            id_employee: userCredential._id,
        });
        const totalProducts = consultsBasket.basket_products;
        await productsSold(totalProducts);
    } catch (e) {
        console.log(e);
    }
};

export const billsController = { createBills };
