import { NextFunction, Request, Response } from "express";
import z, { number, string } from "zod";
import { knex } from "@/database/knex";
import { AppError } from "@/utils/AppError";

export class OrdersController {

    table: string = "orders"

    constructor() {
        this.index = this.index.bind(this);
        this.create = this.create.bind(this);
        this.show = this.show.bind(this);
    }

    async index(req: Request, res: Response, next: NextFunction) {
        try {
            const session_id = z.string().transform((value) => Number(value)).refine((value) => !isNaN(value), { message: "session_id must be a number" }).parse(req.params.session_id)

            const sessionExist = await knex<OrdersRepository>(this.table).where({session_id})

            const data = await knex<OrdersRepository>(this.table).select("orders.id", "orders.session_id", "orders.product_id", "products.name", "orders.price", "orders.quantity", knex.raw("(orders.price * orders.quantity) AS total"), "orders.created_at", "orders.updated_at").join("products", "products.id", "orders.product_id").where({ session_id })

            if (!sessionExist) {
                throw new AppError("Session not found")
            }

            return res.json(data)
        } catch (error) {
            next(error)
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                product_id: z.number(),
                session_id: z.number(),
                quantity: z.number()
            })

            const { session_id, product_id, quantity } = bodySchema.parse(req.body)

            const session = await knex<TableSessionRepository>("tables_sessions").where({ id: session_id }).first()

            if (!session) {
                throw new AppError("sessions table not found")
            }

            if (session.closed_at) {
                throw new AppError("this table is closed")
            }

            const product = await knex<ProductRepository>("products").where({ id: product_id }).first()

            if (!product) {
                throw new AppError('Product not found')
            }

            await knex<OrdersRepository>(this.table).insert({
                product_id,
                session_id,
                quantity,
                price: product.price
            })

            return res.status(201).json()
        } catch (error) {
            next(error)
        }
    }

    async show(req: Request, res: Response, next: NextFunction) {
        try {
            const session_id = z.string().transform((value) => Number(value)).refine((value) => !isNaN(value), { message: "session_id must be a number" }).parse(req.params.session_id)

            const data = await knex<OrdersRepository>(this.table)
            .select(
                knex.raw("COALESCE(SUM(orders.price * orders.quantity), 0) AS total"),
                knex.raw("COALESCE(SUM(orders.quantity), 0) AS quantity"),
            )
            .where({ session_id }).first()

            return res.json(data)
        } catch (error) {
            next(error)
        }
    }

}