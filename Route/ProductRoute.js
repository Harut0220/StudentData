import express, { Router } from "express";
import productController from "../Controller/ProductController.js";

const productRouter = Router();

// productRouter.get("/", productController.get);
productRouter.get("/company",productController.getCompanyName)
productRouter.get("/result",productController.getByName)
productRouter.get("/all",productController.getBank)
productRouter.get("/banks",productController.getBanks)

export default productRouter;
