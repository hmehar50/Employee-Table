import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { formatDate } from '../utils/dateUtils';
import { useEmployeeStore } from '../store/employeeStore.ts';

interface EmployeeTableProps {
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onView: (id: string) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ onEdit, onDelete, onView }) => {
    const { employees, pagination, selectedEmployees, toggleEmployeeSelection, loading } = useEmployeeStore();

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (employees.length === 0) {
        return <div className="text-center py-8 text-gray-500">No employees found</div>;
    }

    return (
        <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-6 py-3 text-left">
                        <input
                            type="checkbox"
                            className="cursor-pointer"
                            checked={selectedEmployees.size === employees.length}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    employees.forEach((emp) => toggleEmployeeSelection(emp._id));
                                } else {
                                    selectedEmployees.forEach((id) => toggleEmployeeSelection(id));
                                }
                            }}
                        />
                    </th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Employee ID</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Phone</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Department</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Position</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Hire Date</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Actions</th>
                </tr>
                </thead>
                <tbody>
                {employees.map((employee) => (
                    <tr key={employee._id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-3">
                            <input
                                type="checkbox"
                                className="cursor-pointer"
                                checked={selectedEmployees.has(employee._id)}
                                onChange={() => toggleEmployeeSelection(employee._id)}
                            />
                        </td>
                        <td className="px-6 py-3 font-medium text-gray-900">{employee.name}</td>
                        <td className="px-6 py-3 text-gray-700">{employee.employeeId}</td>
                        <td className="px-6 py-3 text-gray-700">{employee.email}</td>
                        <td className="px-6 py-3 text-gray-700">{employee.phoneNumber}</td>
                        <td className="px-6 py-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {employee.department}
                </span>
                        </td>
                        <td className="px-6 py-3 text-gray-700">{employee.position}</td>
                        <td className="px-6 py-3 text-gray-700">{formatDate(employee.hireDate)}</td>
                        <td className="px-6 py-3">
                <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                        employee.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}
                >
                  {employee.status}
                </span>
                        </td>
                        <td className="px-6 py-3 flex gap-2">
                            <button
                                onClick={() => onView(employee._id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                title="View"
                            >
                                <FiEye size={18} />
                            </button>
                            <button
                                onClick={() => onEdit(employee._id)}
                                className="p-2 text-amber-600 hover:bg-amber-50 rounded"
                                title="Edit"
                            >
                                <FiEdit2 size={18} />
                            </button>
                            <button
                                onClick={() => onDelete(employee._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                title="Delete"
                            >
                                <FiTrash2 size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-t">
                <div className="text-sm text-gray-600">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </div>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded disabled:opacity-50" disabled={pagination.page === 1}>
                        <FiChevronLeft />
                    </button>
                    <span className="px-3 py-2 bg-blue-100 rounded">{pagination.page}</span>
                    <button
                        className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                        disabled={pagination.page === pagination.pages}
                    >
                        <FiChevronRight />
                    </button>
                </div>
            </div>
        </div>
    );
};