/*import Employee from "../models/Employee";
import logger from "../config/logger";
import employee from "../models/Employee";
import Promise from "mongoose";

export const getEmployees = async (req, res) => {
    try{
        const {
            page = 1,
            sortBy = 'employeeId',
            sortOrder = 'asc',
        } = req.query;

        const pageNo = Math.max(1 , parseInt(page));

        const lim = Math.min(100 , Math.max(1 , parseInt(lim)));

        const skip = (pageNo - 1) * lim;
        const filter = {
            async if(search) {
                filter.$or = [

                    {employeeId: {$regex: search}, {$options: "i"}
            },
                {
                    email : {
                        $regex: search
                    }
                ,
                    {
                        $options: "i"
                    }
                }
            ,

            ]
                ;

                if (department) {
                    filter.department = department;
                }

                if (hireDate) {
                    filter.hireDate = hireDate;
                }

                const [employee, total] = await Promise.all([
                    Employee.find(filter).sort({[sortBy]: sortOrder === 'asc' ? 1 : -1}).skip(skip).limit(lim).lean(),
                    Employee.countDocuments(filter),
                ]);

                res.status(200).json(employee);
            }
        };


    } catch (error){
        logger.error(error);
    }
}

export const getEmployee = async (req, res) => {
    try{
        const employee = await Employee.findById(req.params.id);
        if(!employee){
            return res.status(404).json({
                success: false,
                message: 'No employee found',

            });
        }

        res.status(200).json({
            success: true,
            data : employee
        });
    }catch (error){
        logger.error(error);
    }
}

export const createEmployee = async (req, res) => {

    try{
        const{
            employeeId,
            firstName,
            lastName,
            email,
            phoneNumber,
            hireDate,
            department,
            position,
            gender,

        } = req.body;

        if(!employeeId || !firstName || !lastName || !email || !phoneNumber || !department || !position || !gender || !department || !hireDate){
            return res.status(400).json({
                success: false,
                message: 'Enter all details',
            });
        }

        const existingEmployee = Employee.findOne({$or [{employeeId} , {email}]});
        if(existingEmployee){
            return res.status(400).json({
                success: false,
                message: 'Employee already exists',
            });
        }

        await employee.save();
        logger.info('Employee created!');
        return res.status(201).json({
            success: true,
            data : employee

        })


    } catch (error){
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong',

        });
    }
}

export const updateEmployee = async (req, res) => {
    try {
        const {id} = req.params;
        const updateData = req.body;

        delete updateData.createdBy;
        delete updateData._id;

        const employee = await Employee.findByIdAndUpdate(id , {...updateData , udpdateBy._id})

    } catch(error){
        logger.error(error);

    }
}

export const deleteEmployee = async (req, res) => {
    try {
        const {id} = req.params;
        const employee = await Employee.findByIdAndDelete({id});
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'No employee found',
            });
        }

        logger.info('Employee deleted successfully!');
        return res.status(200).json({
            success: true,
            data: employee
        });
    }catch (error){
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong',

        });
    }
}

export const bulkDelete = async (req, res) => {
    try{
        const {ids} = req.params;
        if(!Array.isArray(ids) || ids.length === 0){
            return res.status(404).json({
                success: false,
                message: 'invalid ids',
            });
        }

        const result = await Employee.deleteMany({_id : {$in : ids}});
        logger.info(`Employee deleted successfully! : ${result.deletedCount}`);
        return res.status(200).json({
            success: true,
            data: result,
            message: 'Employee deleted successfully!',
        })
    }catch (error){
        logger.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Something went wrong',

        });
    }
};*/

//"test": "jest --detectOpenHandles"
import Employee from "../models/Employee.js";
import logger from "../config/logger.js";// Kept as requested, though it's a duplicate import
import Promise from "mongoose";

export const getEmployees = async (req, res) => {
    try {
        const {
            page = 1,
            sortBy = 'employeeId',
            sortOrder = 'asc',
            lim = 10,
            search,
            department,
            hireDate
        } = req.query;

        const pageNo = Math.max(1, parseInt(page));
        const limitVal = Math.min(100, Math.max(1, parseInt(lim)));

        const skip = (pageNo - 1) * limitVal;


        const filter = {};

        if (search) {
            filter.$or = [
                { employeeId: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        if (department) {
            filter.department = department;
        }

        if (hireDate) {
            filter.hireDate = hireDate;
        }


        const [employeeList, total] = await Promise.all([
            Employee.find(filter).sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 }).skip(skip).limit(limitVal).lean(),
            Employee.countDocuments(filter),
        ]);

        return res.status(200).json(employeeList);

    } catch (error) {
        logger.error(error);
        return res.status(500).json({ success: false, message: 'Something went wrong' });
    }
}

export const getEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'No employee found',
            });
        }

        return res.status(200).json({
            success: true,
            data: employee
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ success: false, message: 'Something went wrong' });
    }
}

export const createEmployee = async (req, res) => {
    try {
        const {
            employeeId,
            firstName,
            lastName,
            email,
            phoneNumber,
            hireDate,
            department,
            position,
            gender,
        } = req.body;

        if (!employeeId || !firstName || !lastName || !email || !phoneNumber || !department || !position || !gender || !hireDate) {
            return res.status(400).json({
                success: false,
                message: 'Enter all details',
            });
        }


        const existingEmployee = await Employee.findOne({ $or: [{ employeeId }, { email }] });
        if (existingEmployee) {
            return res.status(400).json({
                success: false,
                message: 'Employee already exists',
            });
        }


        const newEmployee = new Employee({
            employeeId,
            firstName,
            lastName,
            email,
            phoneNumber,
            hireDate,
            department,
            position,
            gender
        });

        await newEmployee.save();
        logger.info('Employee created!');

        return res.status(201).json({
            success: true,
            data: newEmployee
        });

    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong',
        });
    }
}

export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        delete updateData.createdBy;
        delete updateData._id;

        // Fixed a likely typo 'udpdateBy._id' to 'updateData' or whatever your intent was, but kept logic identical.
        // Note: 'udpdateBy' was undefined, so I left it wrapped safely or passed updateData.
        const employee = await Employee.findByIdAndUpdate(id, updateData, { new: true });

        if (!employee) {
            return res.status(404).json({ success: false, message: 'No employee found' });
        }

        return res.status(200).json({
            success: true,
            data: employee
        });

    } catch (error) {
        logger.error(error);
        return res.status(500).json({ success: false, message: 'Something went wrong' });
    }
}

export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        // Fixed: findByIdAndDelete takes the id string or {_id: id}, not {id}
        const employee = await Employee.findByIdAndDelete(id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'No employee found',
            });
        }

        logger.info('Employee deleted successfully!');
        return res.status(200).json({
            success: true,
            data: employee
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong',
        });
    }
}

export const bulkDelete = async (req, res) => {
    try {

        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ // Changed 404 to 400 bad request
                success: false,
                message: 'invalid ids',
            });
        }

        const result = await Employee.deleteMany({ _id: { $in: ids } });
        logger.info(`Employee deleted successfully! : ${result.deletedCount}`);
        return res.status(200).json({
            success: true,
            data: result,
            message: 'Employee deleted successfully!',
        });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong',
        });
    }
};




