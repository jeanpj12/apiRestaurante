import { OrdersController } from "@/controllers/orders-controller";
import { Router } from "express";

export const ordersRoutes = Router()
const ordersController = new OrdersController()

ordersRoutes.get("/session/:session_id", ordersController.index)
ordersRoutes.get("/session/:session_id/total", ordersController.show)
ordersRoutes.post("/", ordersController.create)