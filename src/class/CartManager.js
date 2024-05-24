import cartsModel from "../models/carts.model.js";


class CartManager {

    constructor() {

    }


    async addProductToCart(data) {
        try {
            let idProduct = data
            let cart = await cartsModel.findOne({ _id: "664e9328e81a669cf6935935" })
            console.log(cart)
            //Consulto que esten todos los datos cargados
            if (!idProduct) {
                console.log({ status: "error", error: "Faltan parametros" })
            }

            cart.products.push({ productId: idProduct })
            cart.total = cart.products.length
            let result = await cartsModel.updateOne({ _id: "664e9328e81a669cf6935935" }, cart)

            //Retorno el result para que finalice la funcion           
            return result
        }
        catch (error) {
            console.error("Error al crear producto", error);
        }
    }

    async getProductsToCart() {
        //Metodo para obtener todos los productos
        try {
            //Leo el archivo
            const data = await cartsModel.find().lean()
            //Tengo que transformar lo que me devuelve (texto) en un objeto
            return data
        } catch (error) {
            if (error.code === 'ENOENT') {
                return []
            } else {
                throw error
            }
        }
    }

    async deleteProductToCart() {
        try {

        } catch (error) {
            console.log(error);
        }
    }

    async updateCart() {
        try {

        } catch (error) {
            console.log(error);
        }
    }

    async deleteProductsToCart() {
        try {

        } catch (error) {
            console.log(error);
        }
    }
}

export default CartManager