import express, { Router } from "express";
import productController from "../Controller/ProductController.js";
// import companyController from "../Controller/companyController.js";
// import byOneController from "../Controller/byOneController.js";

const productRouter = Router();

// productRouter.get("/", productController.get);
productRouter.get("/create/companys",productController.getCompanyName)
productRouter.get("/create/trademarks",productController.createTrademarks)
productRouter.get("/get/companys",productController.getData)
productRouter.get("/telegram",productController.getTelegram)
// productRouter.get("/result",productController.getByName)
// productRouter.get("/linkbypage",productController.getBank)
// productRouter.get("/banks",productController.getBanks)
// productRouter.get("/bypagerescmpanys",companyController.getCompanyByPageLinks)

// productRouter.get("/hatihamar",byOneController.getByOne)

export default productRouter;
