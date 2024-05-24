import productModel from '../models/products.model.js';

class ProductManager {
    constructor() {
       
    }
    async getProducts() {
        //Metodo para obtener todos los productos
        try {
            //Leo el archivo
            const data = await productModel.find().lean()
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

    async getProductsPaginate(data){
        try {
            const options = {
              page: 1,
              limit: 10,
              lean: true
            };
        
            const result = await productModel.paginate({}, options);
            
            //console.log('Productos paginados:', result);
            // Puedes procesar el resultado aquí, por ejemplo, devolverlo como respuesta en una API
            return result;
          } catch (error) {
            console.error('Error al obtener productos paginados:', error);
            throw error;
          }
        }
    
    async addProduct(data) {
        try {
            //Desestructuramos el objeto
            let { name, description, price, category, available } = data
            //Consulto que esten todos los datos cargados
            if (!name || !description || !price || !category || !available) {
                console.log({ status: "error", error: "Faltan parametros" })
            }
            //Uso el metodo create para agregar cada uno de los campos de la collection
            let result = await productModel.create({  name, description, price, category, available })

            //Retorno el result para que finalice la funcion           
            return result
        }
        catch (error) {
            console.error("Error al crear producto", error);
        }
    }

    async deleteProduct(idProduct) {
        try {

            //Comparamos el _id de la base de datos con el id de nuestro producto
            let result = await productModel.deleteOne({ _id: idProduct })

            console.log("Elemento borrado con exito")

            return result

        } catch (error) {
            console.error("Error no se pudo borrar el item", error);
        }
    }

    async updateProduct(idProduct, updateData) {
        try {
            let {  name, description, price, category, available } = updateData
            //Consulto que esten todos los datos cargados
            if (!name || !description || !price || !category || !available) {
                console.log({ status: "error", error: "Faltan parametros" })
            }
            //Comparamos el _id de la base de datos con el id de nuestro producto

            let result = await productModel.updateOne({ _id: idProduct }, updateData)

            console.log("Producto actualizado con exito");

            return result

        } catch (error) {

        }
    }
}

export default ProductManager