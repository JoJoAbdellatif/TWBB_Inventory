const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName : {
        type: String,
        required: true,
        unique:true
    },

    productDescription : {
        type: String,
        required: true
    },

    productCategory : {
        type: String,
        required: true
    },

    productWeight : {
        type: String,
        required: true
    },

    productImage:{
        type: String
    }

    
});

const product = mongoose.model('product' , productSchema , 'Product');

module.exports = product;