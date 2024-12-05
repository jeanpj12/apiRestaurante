import { AppError } from "@/utils/AppError";
import { errorMonitor } from "events";
import { Response, Request, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandling(error: any, req: Request, res: Response, _: NextFunction) {
    if(error instanceof AppError){
        return res.status(error.statusCode).json({message: error.message})
    }

    if(error instanceof ZodError){
        return res.status(400).json({message: "Validation error", issues: error.format()})
    }

    return res.status(500).json({message: error.message})
}