const fs = require('fs');
const path = './data/carts.json';

class CartManager {
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
        const carts = await this.getAll();
        return carts.find(cart => cart.id === id);
    }

    async addCart(cart) {
        const carts = await this.getAll();
        cart.id = carts.length ? carts[carts.length - 1].id + 1 : 1;
        carts.push(cart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getAll();
        const cart = carts.find(cart => cart.id === cartId);
        if (cart) {
            const productIndex = cart.products.findIndex(p => p.product === productId);
            if (productIndex >= 0) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        }
        return cart;
    }
}

module.exports = CartManager;
