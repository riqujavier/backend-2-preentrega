const express = require('express');
const { Server } = require('socket.io');
const path = require('path');
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const handlebars = require('handlebars');
const mongoose = require('mongoose');

const ProductManager = require('./managers/ProductManager');
const CartManager = require('./managers/CartManager');

const app = express();
const http = require('http').createServer(app);
const io = new Server(http);
const productManager = new ProductManager();
const cartManager = new CartManager();

// Mongoose
mongoose.connect('mongodb+srv://riquelmejavierariel:cAC78d97cVlrGUZv@cluster0.8zd7r.mongodb.net/?tls=true', {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine({
    handlebars: allowInsecurePrototypeAccess(handlebars),
    runtimeOptions: {
        allowedProtoPropertiesByDefault: true,
        allowedProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Pagination
app.get('/products', async (req, res) => {
    try {
        const products = await productManager.getAll();
        res.render('index', { products: products.docs });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/carts', async (req, res) => {
    try {
        const carts = await cartManager.getAll();
        res.render('carts', { carts });
    } catch (error) {
        console.error('Error fetching carts:', error);
        res.status(500).send('Internal Server Error');
    }
    });
// Websockets
app.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getAll();
    res.render('realTimeProducts', { products });
});

io.on('connection', async (socket) => {
    console.log('Cliente conectado');
    const products = await productManager.getAll();
    socket.emit('updateProducts', products.docs);

    socket.on('newProduct', async (product) => {
        const newProduct = await productManager.addProduct(product);
        const updatedProducts = await productManager.getAll();
        io.emit('updateProducts', updatedProducts.docs);
    });

    socket.on('deleteProduct', async (productId) => {
        await productManager.deleteProduct(productId);
        const updatedProducts = await productManager.getAll();
        io.emit('updateProducts', updatedProducts.docs);
    });
});

const PORT = 8080;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
