import productService from "../Service/ProductService.js";
import fetch from "node-fetch";
import fs from "fs"

const productController = {
  getTelegram:async()=>{
    try {
       
      const product = await productService.getTelegram();
      
  
      res.status(200).send(product); 
    } catch (error) {
      console.error(error)
    }
  },
  getCompanyName: async (req, res) => {
    try {
      const { lang_am, page, letter_am} = req.query;
       
      const product = await productService.getCompanyNames(lang_am, page, letter_am);
      
  
      res.status(200).send(product); 
    } catch (error) {
      console.error(error)
    }
  },
  createTrademarks:async(req,res)=>{
    try {
      const {lang, page, letter}=req.query
      
      const result = await productService.createTrademarks(lang, page, letter)
      res.status(200).send(result)
    } catch (error) {
      console.error(error)
    }
    
  },
  getData:async (req,res)=>{
    try {
      const data=await productService.getData()
      res.status(200).send(data)
    } catch (error) {
      console.error(error)
    }
  }
  // getByName: async (req, res) => {
  //   const result = await productService.getByName();
  //   res.send(result);
  // },
  // getBank:async(req,res)=>{
  //   try {
  //     const result=await productService.spyurController()
      
  //     res.status(200).send(result)
  //   } catch (error) {
      
  //   }
  // },
  // getBanks:async (re,res)=>{
  //   try {
  //     const result=await productService.getBanks()
  //     res.status(200).send(result)
  //   } catch (error) {
      
  //   }
  // }
};

export default productController;
