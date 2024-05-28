import express from 'express'
import mongoose from 'mongoose'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import productsRouter from './routes/products.router.js'
import productsaddRouter from './routes/addProducts.router.js'
import messagesRouter from './routes/message.router.js'
import updateRouter from './routes/update.router.js'
import cartRouter from './routes/carts.router.js'
import { Server } from 'socket.io'
import ProductManager from './class/ProductManager.js'
import MessageManager from './class/ChatManager.js'
import CartManager from './class/CartManager.js'
import dotenv from 'dotenv';
dotenv.config()
console.log(process.env.MONGO_URL);

const app = express()
const PORT = 8080
const httpServer = app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

const socketServer = new Server(httpServer)

const productManager = new ProductManager()
const messageManager = new MessageManager()
const cartManager = new CartManager()

//Middleware para poder entender json en las solicitudes 
app.use(express.json())
//Para sacar parametros del enlace (endpoint) se usa esta linea de codigo
app.use(express.urlencoded({ extended: true }))

//Inicializamos el motor
app.engine('handlebars', handlebars.engine());

//Indicamos en que parte estaran las vistas
app.set('views', __dirname + '/views')

//Indicamos que motor de plantillas se usara, 'view engine', 'handlebars'
app.set('view engine', 'handlebars')

//Seteamos de manera estatica nuestra carpeta
app.use(express.static(__dirname + '/public'))

mongoose.connect(process.env.MONGO_URL)
    .then(() => { console.log("Conectado a la base de datos") })
    .catch(error => (console.error("Error en la conexion", error)))

app.use('/products', productsRouter)
app.use('/addproducts', productsaddRouter)
app.use('/chats', messagesRouter)
app.use('/update', updateRouter)
app.use('/carts', cartRouter)

let idProductToUpdate = ""

socketServer.on('connection', socket => {
    console.log("Nuevo cliente conectado");


    messageManager.getChats()
        .then(chats => {
            socketServer.emit('mensaje', chats)
        })

    socket.on('addMensaje', data => {
        console.log(data);
        messageManager.addMessage(data)
            .then(() => {
                messageManager.getChats()
                    .then(chats => {
                        socketServer.emit('mensaje', chats)
                    })
            })
    })

    productManager.getProducts()
        .then(products => {
            console.log("enviando socket");
            socketServer.emit('allProducts', products)
            socketServer.emit('addProductsRealTime', products)
        })
    
    
    cartManager.getProductsToCart()
        .then(productsCart => {
            socketServer.emit('productsCart', productsCart)
        })

    socket.on('dataToPaginate', (dataToPaginate) => {
        productManager.getProductsPaginate(dataToPaginate)
            .then(products => {
                console.log(products);
                socketServer.emit('products', products)
            })
    }) 
    socket.on('addProductToCart', (data) => {
        console.log("Recibiendo producto para agregar al carrito");
        cartManager.addProductToCart(data)
            .then(() => {
                console.log('Mostrando carrito');
                productManager.getProductsPaginate()
                    .then(products => {
                        socketServer.emit('products', products)
                    })
            })
        
    })

    socket.on('addProduct', (data) => {
        console.log("Recibiendo producto agregado");
        productManager.addProduct(data)
            .then(() => {
                console.log("Solicitando mostrar productos");
                productManager.getProducts()
                    .then(products => {
                        socketServer.emit('addProductsRealTime', products)
                    })
            })

    })


    socket.on('deleteProduct', (data) => {
        productManager.deleteProduct(data)
            .then(() => {
                productManager.getProducts()
                    .then((products) => {
                        socketServer.emit('addProductsRealTime', products)
                    })
            })
    })

    socket.on('updateProductPage', (dataPage) => {
        socketServer.emit('redirect', dataPage)
        idProductToUpdate = dataPage.id
    })

    socket.on('addProductsRealTime', (dataPage) => {
        socketServer.emit('redirect', dataPage)
    })

    socket.on('updateProduct', (data) => {
        productManager.updateProduct(idProductToUpdate, data)
            .then(() => {
                productManager.getProducts()
                    .then((products) => {
                        socketServer.emit('addProductsRealTime', products)
                    })
            })
    })

    socket.on('deleteProductToCart', (data) => {
        cartManager.deleteProductToCart(data)
            .then(() => {
                cartManager.getProductsToCart()
                .then(productsCart => {
                    socketServer.emit('productsCart', productsCart)
                })
            })
    })

    socket.on('emptyCart', (data) =>{
        cartManager.deleteAllProductsToCart(data)
        .then(()=> {
            cartManager.getProductsToCart()
            .then(productsCart => {
                socketServer.emit('productsCart', productsCart)
            })
        })
    })
})





