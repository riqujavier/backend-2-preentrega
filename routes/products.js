const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');

const productManager = new ProductManager();

router.get('/', async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    const filter = query ? { $or: [{ category: query }, { status: query }] } : {};
    const products = await productManager.getAll(filter, limit, page, sort);
    res.json({
        status: 'success',
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.hasPrevPage ? page - 1 : null,
        nextPage: products.hasNextPage ? page + 1 : null,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${page-1}&sort=${sort}&query=${query}` : null,
        nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${page+1}&sort=${sort}&query=${query}` : null
    });
});

router.get('/:pid', async (req, res) => {
    const product = await productManager.getById(req.params.pid);
    res.json(product);
});

router.post('/', async (req, res) => {
    const newProduct = await productManager.addProduct(req.body);
    res.json(newProduct);
});

router.put('/:pid', async (req, res) => {
    const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
    res.json(updatedProduct);
});

router.delete('/:pid', async (req, res) => {
    await productManager.deleteProduct(req.params.pid);
    res.sendStatus(204);
});

module.exports = router;
