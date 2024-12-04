import { NextFunction, Request, Response } from "express";
import { ProductController } from "@/controllers/products-controller";
import { Router } from "express";

export const productsRoutes = Router()
const productController = new ProductController()

productsRoutes.get("/", productController.index)