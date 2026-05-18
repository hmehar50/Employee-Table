import Employee from "../models/Employee";
import logger from "../config/logger";

export const getEmployee = async (req, res) => {
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

export const createEmployee = async (req, res) => {

}