const mongoose = require('mongoose');

const priceQuantSchema = new mongoose.Schema({
    productID : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },

    productPrice : {
        type: String,
        required: true
    },

    productQuantity : {
        type: String,
        required: true
    }
});

const price_quant = mongoose.model('price_quant' , priceQuantSchema , 'Price_Quant');

module.exports = price_quant;