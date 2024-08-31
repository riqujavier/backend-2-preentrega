const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');

const cartManager = new CartManager();

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.addCart(req.body);
        res.json(newCart);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getAll();
        res.json(carts);
    } catch (error) {
        console.error('Error fetching carts:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        res.json(cart);
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const updatedCart = await cartManager.updateCart(req.params.cid, req.body.products);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const updatedCart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const updatedCart = await cartManager.deleteProductFromCart(cid, pid);
        res.json({
            status: 'success',
            payload: updatedCart
        });
    } catch (error) {
        res.json({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        await cartManager.deleteAllProducts(req.params.cid);
        res.json({ status: 'success', message: 'All products deleted from cart' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
