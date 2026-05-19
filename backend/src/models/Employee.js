import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
        employeeID: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        } ,
        firstName: {
            type: String,
            required: true,
            trim: true,
            index: true,

        } ,
        lastName: {
            type: String,
            required: true,
            trim: true,
            index: true,

        } ,
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2 , 3})$/, 'invalid email address'],
            index: true,
        } ,

        phoneNumber: {
            type: String,
            required: true,
            match: [/^[0-9]{10,15}$/, 'invalid phone number'],
            index: true,
        } ,
        hireDate: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return value <= new Date();
                },
                message: 'Invalid hire date , hire date cannot be in future',
            },
            index: true,
        } ,
        department: {
            type: String,
            required: true,
            enum: ['Engineering' , 'HR' , 'Finance' , 'Operations'],
            index: true,

        } ,
        position: {
            type: String,
            required: true,
            trim: true,
            index: true,
        } ,
        gender: {
            type: String,
            required: true,
            enum: ['Male' , 'Female' , 'Others'],
            index: true,
        }
    } ,
    {
        timestamps: true,
        collection: 'employees',
    });

EmployeeSchema.index({hireDate: -1});
EmployeeSchema.index({employeeID: -1});
EmployeeSchema.index({departmentID: 1});

EmployeeSchema.pre('save' , async function(next){
    if(this.isModified('email')){
        const existingEmployee = await mongoose.model('Employee').findOne({
            email: this.email,
            _id: { $ne: this._id },
        });
        if(existingEmployee){
            throw new Error('Employee already exists');
        }
    }
    next();
});

const Employee = mongoose.model('Employee', EmployeeSchema);
export default Employee;