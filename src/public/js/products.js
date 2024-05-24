socket = io()

const listProducts = document.getElementById('products')
const btnAddCart = document.createElement('button');

const limit = document.getElementById('limit')
const page = document.getElementById('page')
const query = document.getElementById('query')
const sort = document.getElementById('sort')


socket.on('products', products => {
    listProducts.innerHTML = ``;
    prods = [...products.docs];
    console.log(prods);

    let categorys = []
    let sorteo = ["asc", "desc"]
    listProducts.innerHTML = ""
    prods.forEach(product => {
        const newProduct = document.createElement('li')
        const btnAddCart = document.createElement('button');
        const btnAply = document.createElement('button');

        btnAddCart.innerHTML = "Agregar al carrito";
        btnAply.innerHTML = "Aplicar";
        btnAddCart.addEventListener('click', () => {
            socket.emit('addProductToCart', product._id)
        })
        newProduct.innerHTML = `<strong>Name: </strong>${product.name}, <strong>Description: </strong>${product.description},
        <strong>Price: </strong>${product.price}, <strong>Category: </strong>${product.category}, <strong>Available: </strong>${product.available}`;
        listProducts.append(newProduct)
        listProducts.append(btnAddCart)

        if (!categorys.includes(product.category)) {
            categorys.push(product.category)
            btnAply.addEventListener()
        }
    });

    categorys.forEach(category => {
        let option = document.createElement("option");
        console.log(category);
        option.text = category;
        query.appendChild(option);
    })

    sorteo.forEach(formToSort => {
        let option = document.createElement("option");
        option.value = formToSort
        option.text = formToSort
        sort.appendChild(option)
    })

    limit.value = parseInt(products.limit);
    page.value = parseInt(products.page);

    console.log(limit.value, page.value, query.value, sort.value);

    socket.emit('dataToPaginate',{})

})

