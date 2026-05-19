import { create } from 'zustand';

interface Employee {
    _id: string;
    employeeId: string;
    name: string;
    email: string;
    phoneNumber: string;
    department: string;
    hireDate: string;
    salary: number;
    position: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

interface EmployeeStore {
    employees: Employee[];
    pagination: Pagination;
    loading: boolean;
    searchTerm: string;
    filters: {
        department?: string;
        status?: string;
    };
    selectedEmployees: Set<string>;

    setEmployees: (employees: Employee[]) => void;
    setPagination: (pagination: Pagination) => void;
    setLoading: (loading: boolean) => void;
    setSearchTerm: (term: string) => void;
    setFilters: (filters: Partial<EmployeeStore['filters']>) => void;
    toggleEmployeeSelection: (id: string) => void;
    clearSelection: () => void;
    addEmployee: (employee: Employee) => void;
    updateEmployee: (employee: Employee) => void;
    removeEmployee: (id: string) => void;
}

export const useEmployeeStore = create<EmployeeStore>((set) => ({
    employees: [],
    pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    loading: false,
    searchTerm: '',
    filters: {},
    selectedEmployees: new Set(),

    setEmployees: (employees) => set({ employees }),
    setPagination: (pagination) => set({ pagination }),
    setLoading: (loading) => set({ loading }),
    setSearchTerm: (searchTerm) => set({ searchTerm }),
    setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
    toggleEmployeeSelection: (id) =>
        set((state) => {
            const newSelected = new Set(state.selectedEmployees);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return { selectedEmployees: newSelected };
        }),
    clearSelection: () => set({ selectedEmployees: new Set() }),
    addEmployee: (employee) =>
        set((state) => ({ employees: [employee, ...state.employees] })),
    updateEmployee: (employee) =>
        set((state) => ({
            employees: state.employees.map((emp) => (emp._id === employee._id ? employee : emp)),
        })),
    removeEmployee: (id) =>
        set((state) => ({
            employees: state.employees.filter((emp) => emp._id !== id),
        })),
}));