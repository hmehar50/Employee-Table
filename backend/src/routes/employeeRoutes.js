import express from 'express';
import * as employeeController from "../controllers/employeeController.js";


const router = express.Router();

router.get('/' , employeeController.getEmployees);

router.get('/:id' , employeeController.getEmployee);

router.post('/', employeeController.createEmployee);

router.put('/:id' , employeeController.updateEmployee);

router.delete('/:id' , employeeController.deleteEmployee);

router.post('/bulkDelete' , employeeController.bulkDelete);

//router.post('/export/csv' , employeeController.exportEmployee);

export default router;