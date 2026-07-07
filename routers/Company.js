import { Router } from 'express';
import CompanyController from '../controllers/Company.js';
import { requireAdmin, requireAuth, requireSelfOrAdmin, forceOwnBody } from '../middlewares/auth.js';
import { requireOwnedRecord } from '../middlewares/ownership.js';
import { Company } from '../models/company.js';

const companyRouter = Router();

companyRouter.post('/company', requireAuth, forceOwnBody({ fullNameField: 'fullName' }), CompanyController.createCompany);
companyRouter.get('/company', requireAuth, requireAdmin, CompanyController.getAllCompanies);
companyRouter.get('/company/:id', requireAuth, requireOwnedRecord(Company, { label: 'Компания' }), CompanyController.getOneCompany);
companyRouter.get('/companies/:userId', requireAuth, requireSelfOrAdmin('userId'), CompanyController.getAllCompaniesByUser);
companyRouter.get('/companies/:userId/:listName', requireAuth, requireSelfOrAdmin('userId'), CompanyController.getAllCompaniesByUserAndList);
companyRouter.delete('/company/:id', requireAuth, requireOwnedRecord(Company, { label: 'Компания' }), CompanyController.deleteCompany);
companyRouter.patch('/company/:id', requireAuth, requireOwnedRecord(Company, { label: 'Компания' }), forceOwnBody({ fullNameField: 'fullName' }), CompanyController.updateCompany);

export default companyRouter;
