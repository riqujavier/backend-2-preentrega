const express = require('express');
const { Server } = require('socket.io');
const path = require('path');
const exphbs = require('express-handlebars');
const ProductManager = require('./managers/ProductManager');

const app = express();
const http = require('http').createServer(app);
const io = new Server(http);
const productManager = new ProductManager();

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.get('/products', async (req, res) => {
    const products = await productManager.getAll();
    res.render('index', { products });
});

app.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getAll();
    res.render('realTimeProducts', { products });
});

io.on('connection', async (socket) => {
    console.log('Cliente conectado');
    const products = await productManager.getAll();
    socket.emit('updateProducts', products);

    socket.on('newProduct', async (product) => {
        const newProduct = await productManager.addProduct(product);
        const updatedProducts = await productManager.getAll();
        io.emit('updateProducts', updatedProducts);
    });

    socket.on('deleteProduct', async (productId) => {
        await productManager.deleteProduct(parseInt(productId));
        const updatedProducts = await productManager.getAll();
        io.emit('updateProducts', updatedProducts);
    });
});

const PORT = 8080;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
