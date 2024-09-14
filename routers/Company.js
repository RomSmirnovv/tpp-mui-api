import { Router } from "express";
import CompanyController from '../controllers/Company.js';

const companyRouter = Router();

companyRouter.post("/company", CompanyController.createCompany)
companyRouter.get("/company/:id", CompanyController.getOneCompany)
companyRouter.get("/company", CompanyController.getAllCompanies)
companyRouter.get("/companies/:userId", CompanyController.getAllCompaniesByUser)
companyRouter.get("/companies/:userId/:listName", CompanyController.getAllCompaniesByUserAndList)
companyRouter.delete("/company/:id", CompanyController.deleteCompany)
companyRouter.patch("/company/:id", CompanyController.updateCompany)

export default companyRouter;
