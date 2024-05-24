socket = io()

const listProducts = document.getElementById('products')

function appendProduct(product) {
    const newProduct = document.createElement('li')
    const btnDelete = document.createElement('button');

    btnDelete.innerHTML = "Borrar"
    newProduct.innerHTML = `<strong>Name: </strong>${product.name}, <strong>Description: </strong>${product.description},
    <strong>Price: </strong>${product.price}, <strong>Category: </strong>${product.category}, <strong>Available: </strong>${product.available}`;
    listProducts.append(newProduct)
    listProducts.append(btnDelete)
}

socket.on('productsCart', products => {
  
    console.log(products);


    listProducts.innerHTML = ""
    products.forEach(product => {
        appendProduct(product);
    });


})
