const fs = require('fs');
const path = './data/products.json';

class ProductManager {
    constructor() {
        this.path = path;
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify([]));
        }
    }

    async getAll() {
        const data = await fs.promises.readFile(this.path, 'utf-8');
        return JSON.parse(data);
    }

    async getById(id) {
        const products = await this.getAll();
        return products.find(product => product.id === id);
    }

    async addProduct(product) {
        const products = await this.getAll();
        product.id = products.length ? products[products.length - 1].id + 1 : 1;
        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return product;
    }

    async updateProduct(id, updatedProduct) {
        let products = await this.getAll();
        products = products.map(product => (product.id === id ? { ...product, ...updatedProduct, id: product.id } : product));
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return products.find(product => product.id === id);
    }

    async deleteProduct(id) {
        let products = await this.getAll();
        products = products.filter(product => product.id !== id);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    }
}

module.exports = ProductManager;
