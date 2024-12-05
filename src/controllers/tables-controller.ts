import { NextFunction, Request, Response } from "express";
import z, { number, string } from "zod";
import { knex } from "@/database/knex";
import { AppError } from "@/utils/AppError";

export class TableController {

    table: string = "tables"

    constructor(){
        this.index = this.index.bind(this);
    }

    async index(req: Request, res: Response, next: NextFunction) {
        try {
            const { table } = req.query
            const data = await knex<TableRepository>(this.table).select().whereLike("table_number", `%${table ?? ""}%`).orderBy("table_number")
            return res.json(data)
        } catch (error) {
            next(error)
        }
    }
}