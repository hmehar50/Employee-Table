/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App*/
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FiPlus, FiDownload, FiTrash2, FiX } from 'react-icons/fi';
import api from './services/api';
import { useEmployeeStore } from './store/employeeStore.ts';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeForm } from './components/EmployeeForm';

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
}

function App() {
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    employees,
    loading,
    searchTerm,
    filters,
    selectedEmployees,
    setEmployees,
    setPagination,
    setLoading,
    setSearchTerm,
    setFilters,
    clearSelection,
  } = useEmployeeStore();

  // Fetch employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await api.getEmployees({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        ...filters,
      });
      setEmployees(data.data);
      setPagination(data.pagination);
    } catch (error) {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, searchTerm, filters]);

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setShowForm(true);
  };

  const handleEditEmployee = async (id: string) => {
    try {
      const data = await api.getEmployee(id);
      setSelectedEmployee(data.data);
      setShowForm(true);
    } catch (error) {
      toast.error('Failed to fetch employee details');
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      await api.deleteEmployee(id);
      toast.success('Employee deleted successfully');
      fetchEmployees();
    } catch (error) {
      toast.error('Failed to delete employee');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEmployees.size === 0) {
      toast.error('No employees selected');
      return;
    }

    if (!window.confirm(`Delete ${selectedEmployees.size} employee(s)?`)) return;

    try {
      await api.bulkDeleteEmployees(Array.from(selectedEmployees));
      toast.success('Employees deleted successfully');
      clearSelection();
      fetchEmployees();
    } catch (error) {
      toast.error('Failed to delete employees');
    }
  };

  const handleExport = async () => {
    try {
      const blob = await api.exportEmployees();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success('Employees exported successfully');
    } catch (error) {
      toast.error('Failed to export employees');
    }
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />

        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Employee Management System</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {showForm ? (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
                  </h2>
                  <button
                      onClick={() => setShowForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                <EmployeeForm
                    initialData={selectedEmployee || undefined}
                    onSuccess={() => {
                      setShowForm(false);
                      fetchEmployees();
                    }}
                    onCancel={() => setShowForm(false)}
                />
              </div>
          ) : (
              <>
                {/* Filters and Actions */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <input
                          type="text"
                          placeholder="Search by name, ID, or email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <select
                        value={filters.department || ''}
                        onChange={(e) => setFilters({ department: e.target.value || undefined })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Departments</option>
                      <option value="Engineering">Engineering</option>
                      <option value="HR">HR</option>
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                    </select>
                    <select
                        value={filters.status || ''}
                        onChange={(e) => setFilters({ status: e.target.value || undefined })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <button
                        onClick={handleAddEmployee}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <FiPlus /> Add Employee
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <FiDownload /> Export CSV
                    </button>
                    {selectedEmployees.size > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <FiTrash2 /> Delete ({selectedEmployees.size})
                        </button>
                    )}
                  </div>
                </div>

                {/* Table */}
                <EmployeeTable
                    onEdit={handleEditEmployee}
                    onDelete={handleDeleteEmployee}
                    onView={handleEditEmployee}
                />
              </>
          )}
        </main>
      </div>
  );
}

export default App;
