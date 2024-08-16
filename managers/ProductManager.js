const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class ProductManager {
    constructor() {
        this.filePath = path.join(__dirname, '..', 'data', 'products.json');
    }

    async getAll() {
        const data = await fs.readFile(this.filePath, 'utf-8');
        return JSON.parse(data || '[]');
    }

    generateId(products) {
        return products.length ? products[products.length - 1].id + 1 : 1;
    }

    generateCode() {
        return crypto.randomBytes(4).toString('hex');
    }
    async addProduct(product) {
        const products = await this.getAll();
        const newProduct = { 
            id: this.generateId(products), 
            code: this.generateCode(), 
            ...product 
        };
        products.push(newProduct);
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
        return newProduct;
    }
    async getById(id) {
        const products = await this.getAll();
        return products.find(product => product.id === id);
    }
    async deleteProduct(id) {
        let products = await this.getAll();
        products = products.filter(product => product.id !== id);
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    }

    async updateProduct(id, updatedProduct) {
        let products = await this.getAll();
        products = products.map(product => (product.id === id ? { ...product, ...updatedProduct, id: product.id } : product));
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
        return products.find(product => product.id === id);
    }
}

module.exports = ProductManager;
