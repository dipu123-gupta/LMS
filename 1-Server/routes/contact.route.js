import { Router } from "express";
import contactUs from "../controllers/contact.controllor.js";

const contactRouter = Router();

contactRouter.post("/", contactUs);

export default contactRouter;
