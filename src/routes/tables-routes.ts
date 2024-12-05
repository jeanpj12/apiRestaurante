import { TableController } from "@/controllers/tables-controller";
import { Router } from "express";

export const tablesRoutes = Router()
const tableController = new TableController()

tablesRoutes.get("/", tableController.index)