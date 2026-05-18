import Employee from "../models/Employee";
import logger from "../config/logger";
import employee from "../models/Employee";

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
            if(search){
                filter.$or = [

                    {employeeId : {$regex: search}, {$options: "i"}},
                {email : {$regex: search}, {$options: "i"}},

                ];

                if(department){
                    filter.department = department;
                }

                if(hireDate){
                    filter.hireDate = hireDate;
                }

                const [employee , total] = await Promise.all([
                    Employee.find(filter).sort({[sortBy] : sortOrder === 'asc'?1:-1}).skip(skip).limit(lim).lean() ,
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
            firstName;
            lastName,
            email,
            phoneNumber,
            hireDate,
            department,
            position,
            gender,

        }

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

}

export const exportEmployee = async (req, res) => {

}
