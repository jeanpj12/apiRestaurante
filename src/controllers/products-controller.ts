import { NextFunction, Request, Response } from "express";
import z, { number, string } from "zod";
import { knex } from "@/database/knex";
import { AppError } from "@/utils/AppError";

export class ProductController {

    table: string = "products"

    constructor(){
        this.index = this.index.bind(this);
        this.create = this.create.bind(this);
        this.remove = this.remove.bind(this);
        this.update = this.update.bind(this);
    }

    async index(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.query
            const data = await knex<ProductRepository>(this.table).select().whereLike("name", `%${name ?? ""}%`).orderBy("name")
            return res.json(data)
        } catch (error) {
            next(error)
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                name: z.string().trim().min(3),
                price: z.number().gt(0)
            })

            const { name, price } = bodySchema.parse(req.body)

            await knex<ProductRepository>(this.table).insert({ price, name })

            return res.status(201).json()
        } catch (error) {
            next(error)
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = z.string().transform((value) => Number(value)).refine((value) => !isNaN(value), {message: "id must be a number"}).parse(req.params.id)

            const bodySchema = z.object({
                name: z.string().trim().min(3).optional(),
                price: z.number().gt(0).optional()
            })

            const { name, price } = bodySchema.parse(req.body)

            const product = await knex<ProductRepository>(this.table).select().where({ id }).first()

            if(!product) {
                throw new AppError("Product not found")
            }

            await knex<ProductRepository>(this.table).update({ price, name, updated_at: knex.fn.now() }).where({ id })

            return res.json()
        } catch (error) {
            next(error)
        }
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const id = z.string().transform((value) => Number(value)).refine((value) => !isNaN(value), {message: "id must be a number"}).parse(req.params.id)

            const product = await knex<ProductRepository>(this.table).select().where({ id }).first()

            if(!product) {
                throw new AppError("Product not found")
            }

            await knex<ProductRepository>(this.table).delete().where({ id })

            return res.json()
        } catch (error) {
            next(error)
        }
    }
}