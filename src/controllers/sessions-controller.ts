import { NextFunction, Request, Response } from "express";
import z, { number, string } from "zod";
import { knex } from "@/database/knex";
import { AppError } from "@/utils/AppError";

export class TableSessionController {

    table: string = "tables_sessions"

    constructor() {
        this.index = this.index.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
    }

    async index(req: Request, res: Response, next: NextFunction) {
        try {
            const { all } = req.query
            let data = await knex<TableSessionRepository>(this.table).whereNull("closed_at").orderBy("closed_at")
            if (all) {
                data = await knex<TableSessionRepository>(this.table).select().orderBy("closed_at")
            }
            return res.json(data)
        } catch (error) {
            next(error)
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                table_id: z.number()
            })

            const { table_id } = bodySchema.parse(req.body)

            const tableIsOpened = await knex<TableSessionRepository>(this.table).where({ table_id }).first()

            if (tableIsOpened && !tableIsOpened.closed_at) {
                throw new AppError("Opened table, try another")
            }

            await knex<TableSessionRepository>(this.table).insert({ table_id })

            return res.status(201).json()
        } catch (error) {
            next(error)
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = z.string().transform((value) => Number(value)).refine((value) => !isNaN(value), { message: "id must be a number" }).parse(req.params.id)

            const table = await knex<TableSessionRepository>(this.table).where({ id }).first()

            if (!table || table.closed_at) {
                throw new AppError("Table not found or Table is already Closed")
            }

            await knex<TableSessionRepository>(this.table).update({ closed_at: knex.fn.now() }).where({ id })

            return res.json()
        } catch (error) {
            next(error)
        }
    }
}