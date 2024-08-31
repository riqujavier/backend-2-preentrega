const Product = require('../models/Product');

class ProductManager {
    async getAll(query = {}, limit = 10, page = 1, sort = null) {
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
        };
        const products = await Product.paginate(query, options);
        return products;
    }

    async getById(id) {
        return await Product.findById(id);
    }

    async addProduct(productData) {
        const product = new Product(productData);
        return await product.save();
    }

    async updateProduct(id, updatedProduct) {
        return await Product.findByIdAndUpdate(id, updatedProduct, { new: true });
    }

    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }
}

module.exports = ProductManager;
