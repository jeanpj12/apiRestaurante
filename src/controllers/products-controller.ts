import { NextFunction, Request, Response } from "express";

export class ProductController {
    async index (req: Request, res: Response, next: NextFunction) {
        try {
            console.log("New request in /products")
            return res.json({ message: "ok" })
        } catch (error) {
            next(error)
        }
    }
}