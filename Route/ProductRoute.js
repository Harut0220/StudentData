import express, { Router } from "express";
import productController from "../Controller/ProductController.js";
import companyController from "../Controller/companyController.js";
import byOneController from "../Controller/byOneController.js";

const productRouter = Router();

// productRouter.get("/", productController.get);
// productRouter.get("/company",productController.getCompanyName)
// productRouter.get("/result",productController.getByName)
productRouter.get("/linkbypage",productController.getBank)
productRouter.get("/banks",productController.getBanks)
productRouter.get("/bypagerescmpanys",companyController.getCompanyByPageLinks)

productRouter.get("/hatihamar",byOneController.getByOne)

export default productRouter;
