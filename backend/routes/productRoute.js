const express =require("express");
const { 
    getAllProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getProductDetails,
    createProductReview,
    getProductReviews,
    deleteReview, 
} = require("../controllers/productController");

const router=express.Router();

router.route("/products").get(getAllProducts);

router.route("/product/new").post(createProduct);

router
    .route("/product/:id")
    .put(updateProduct)
    .delete(deleteProduct)
    .get(getProductDetails);

router.route("/product/:id").get(getProductDetails);

router.route("/reviews").put(createProductReview);

router
    .route("/reviews")
    .get(getProductReviews)
    .delete(deleteReview);

module.exports=router;
