import axios, {type AxiosInstance, AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface EmployeeFilters {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
}

interface EmployeeData {
    employeeId: string;
    name: string;
    email: string;
    phoneNumber: string;
    department: string;
    hireDate: string;
    salary: number;
    position: string;
    status?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
}

class ApiService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });


        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                const message = (error.response?.data as any)?.message || 'An error occurred';
                toast.error(message);
                return Promise.reject(error);
            }
        );
    }


    async getEmployees(filters: EmployeeFilters = {}) {
        const response = await this.axiosInstance.get('/employees', { params: filters });
        return response.data;
    }


    async getEmployee(id: string) {
        const response = await this.axiosInstance.get(`/employees/${id}`);
        return response.data;
    }


    async createEmployee(data: EmployeeData) {
        const response = await this.axiosInstance.post('/employees', data);
        return response.data;
    }


    async updateEmployee(id: string, data: Partial<EmployeeData>) {
        const response = await this.axiosInstance.put(`/employees/${id}`, data);
        return response.data;
    }


    async deleteEmployee(id: string) {
        const response = await this.axiosInstance.delete(`/employees/${id}`);
        return response.data;
    }


    async bulkDeleteEmployees(ids: string[]) {
        const response = await this.axiosInstance.post('/employees/bulk-delete', { ids });
        return response.data;
    }

}

export default new ApiService();