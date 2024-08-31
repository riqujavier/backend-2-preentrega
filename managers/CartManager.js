const Cart = require('../models/Cart'); 
const mongoose = require('mongoose');


class CartManager {

    async getAll() {
        try {
          const carts = await Cart.find().populate('products.product').exec();
          return carts;
        } catch (error) {
          throw new Error('Error fetching carts: ' + error.message);
        }
      }
    async getCartById(cid) {
        return await Cart.findById(cid).populate('products.product'); 
    }

    async addCart(cartData) {
        const newCart = new Cart(cartData);
        return await newCart.save();
    }

    async updateCart(cid, products) {
        const cart = await Cart.findById(cid);
        if (!cart) {
            throw new Error('Cart not found');
        }
        cart.products = products;
        return await cart.save();
    }

    async updateProductQuantity(cid, pid, quantity) {
        const cart = await Cart.findById(cid);
        if (!cart) {
            throw new Error('Cart not found');
        }
        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex === -1) {
            throw new Error('Product not found in cart');
        }
        cart.products[productIndex].quantity = quantity;
        return await cart.save();
    }

    async deleteProductFromCart(cartId, productId) {

        if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid ID format');
        }

        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex === -1) {
            throw new Error('Product not found in cart');
        }

        cart.products.splice(productIndex, 1);
        await cart.save();

        return cart;
    }
    

    async deleteAllProducts(cid) {
        const cart = await Cart.findById(cid);
        if (!cart) {
            throw new Error('Cart not found');
        }
        cart.products = [];
        return await cart.save();
    }
}

module.exports = CartManager; 
