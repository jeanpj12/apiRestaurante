import { TableSessionController } from "@/controllers/sessions-controller";
import { Router } from "express";

export const tablesSessionsRoutes = Router()
const tableSessionController = new TableSessionController()

tablesSessionsRoutes.get("/", tableSessionController.index)
tablesSessionsRoutes.post("/", tableSessionController.create)
tablesSessionsRoutes.patch("/:id/close", tableSessionController.update)