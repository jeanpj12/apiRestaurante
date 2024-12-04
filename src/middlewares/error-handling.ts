import { AppError } from "@/utils/AppError";
import { Response, Request, NextFunction } from "express";

export function errorHandling(error: any, req: Request, res: Response, _: NextFunction) {
    if(error instanceof AppError){
        return res.status(error.statusCode).json({message: error.message})
    }

    return res.status(500).json({message: error.message})
}