const express = require('express');
const mongoose = require('mongoose');
const CSVtoJSON = require('csvtojson');
const asyncHandler = require('express-async-handler');
const product = require('../models/product');
const productPrice = require('../models/price_quant');


const productRoute = express.Router();

productRoute.get('/details/:id',asyncHandler( async (req , res) => {
    const productExist = await product.findOne({ _id:req.params.id});
    if(!productExist){
        throw new Error('Product does not exist');
    }
    
    res.status(200).json(productExist);

}))
productRoute.get('/price/:id',asyncHandler( async (req , res) => {
    const prodPrice = await productPrice.findOne({ productID:req.params.id});
    if(!prodPrice){
        throw new Error('Product does not exist');
    }
    
    res.status(200).json(prodPrice);

}))


productRoute.get('/',asyncHandler( async (req , res) => {
    const productPerPage = 10
    const page = req.query.page||0

    const joinedTable = await product.aggregate([
        {
            $lookup:
            {
                from: "Price_Quant",
                localField: "_id",
                foreignField: "productID",
                as: "productReference"
            }
        }
    ]).skip(page*productPerPage).limit(productPerPage).then((productsInPage)=>{
        res.status(200).json(productsInPage)
    }).catch(()=>{
        new Error('No Products Found')
        res.status(500)
    })

  
}))

productRoute.get('/search',asyncHandler( async (req , res) => {
    const productPerPage = 10
    const searchInput = req.query.searchInput||""
    const page = req.query.page||0
    const regex = new RegExp(searchInput, 'i') 
    const products = await product.find({
        productName: regex,
      }).skip(page*productPerPage).limit(productPerPage).then((productsInPage)=>{
        
        res.status(200).json(productsInPage)
    }).catch(()=>{
        new Error('No Products Found')
        res.status(500)
    })
    
}))

productRoute.post('/addProduct' , asyncHandler(async (req , res) => {
    let filePath = 'inventoryService/downloads/Products.csv';
    let counter = 0;
    CSVtoJSON().fromFile(filePath).then(async (productJSON) => {
        for (let i = 0; i < productJSON.length; i++) {
            const indexedProduct = await product.findOne({productName : productJSON[i].productName});
            if(indexedProduct){
                res.status(500);
                throw new Error('Already Created')
                
            }
            else{
                const prod =await product.create({productName : productJSON[i].productName , productDescription : productJSON[i].productDescription , productCategory : productJSON[i].productCategory , productWeight : productJSON[i].productWeight});
                await productPrice.create({productID:prod._id,productPrice:productJSON[i].productPrice,productQuantity:productJSON[i].productQuantity})
                counter+=1;
            }
        }
        res.send(`Added ${counter} Products`);
    })

}))

productRoute.patch('/updateProducts' , asyncHandler(async (req , res) => {
    let filePath = 'inventoryService/downloads/updating_product.csv';
    let counter = 0;
    let outOfStock= 0;
    CSVtoJSON().fromFile(filePath).then(async (productJSON) => {
        for (let i = 0; i < productJSON.length; i++) {
            const indexedProduct = await product.findOne({productName : productJSON[i].productName});
            if(indexedProduct){
                if(productJSON[i].productQuantity==0){
                    outOfStock+=1
                }
                counter+=1
                await productPrice.findOne({productID:indexedProduct._id}).updateOne({productPrice:productJSON[i].productPrice,productQuantity:productJSON[i].productQuantity})
            }
            else{
                res.status(500)
            }

        }
        res.send(`${counter} have been updated \n There are ${outOfStock} items out of stock`);
    })

}))


module.exports = productRoute

