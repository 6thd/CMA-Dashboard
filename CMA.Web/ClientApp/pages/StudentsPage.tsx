import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Student } from '../types.js';
import Modal from '../components/Modal.js';
import { useUser } from '../contexts/UserContext.js';
import logService from '../services/logService.js';

const MOCK_STUDENTS: Student[] = [
    { id: '1', full_name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', enrollment_date: '2023-01-15', status: 'active' },
    { id: '2', full_name: 'Jane Smith', email: 'jane.smith@example.com', phone: '234-567-8901', enrollment_date: '2023-02-20', status: 'active' },
    { id: '3', full_name: 'Mike Johnson', email: 'mike.j@example.com', phone: '345-678-9012', enrollment_date: '2023-03-10', status: 'inactive' },
    { id: '4', full_name: 'Emily Davis', email: 'emily.d@example.com', phone: '456-789-0123', enrollment_date: '2023-04-05', status: 'suspended' },
];

const StatusChip: React.FC<{ status: Student['status'] }> = ({ status }) => {
    const statusStyles = {
        active: 'bg-green-500/20 text-green-300 border border-green-500/30',
        inactive: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
        suspended: 'bg-red-500/20 text-red-400 border border-red-500/30',
    };
    return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};


const StudentsPage: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const { currentUser } = useUser();
    const isModerator = currentUser.role === 'Moderator';

    useEffect(() => {
        // Simulate API fetch
        setTimeout(() => {
            setStudents(MOCK_STUDENTS);
            setLoading(false);
        }, 500);
    }, []);

    const handleOpenModal = (student: Student | null = null) => {
        setEditingStudent(student);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStudent(null);
    };

    const handleSaveStudent = (studentData: Omit<Student, 'id' | 'enrollment_date'>) => {
        if (editingStudent) {
            // When updating, we merge the new data, preserving the original enrollment_date
            setStudents(students.map(s => s.id === editingStudent.id ? { ...s, ...studentData } : s));
            logService.addLog(currentUser, 'UPDATE_STUDENT', `Updated details for student: ${studentData.full_name} (ID: ${editingStudent.id})`);
        } else {
            // When creating, we add the new student with a new id and enrollment_date
            const newStudent: Student = { 
                ...studentData, 
                id: String(Date.now()), 
                enrollment_date: new Date().toISOString().split('T')[0] 
            };
            setStudents([newStudent, ...students]);
            logService.addLog(currentUser, 'CREATE_STUDENT', `Created new student: ${studentData.full_name}`);
        }
        handleCloseModal();
    };
    
    const handleDeleteStudent = (id: string) => {
      const studentToDelete = students.find(s => s.id === id);
      if (studentToDelete && window.confirm('Are you sure you want to delete this student?')) {
        setStudents(students.filter(s => s.id !== id));
        logService.addLog(currentUser, 'DELETE_STUDENT', `Deleted student: ${studentToDelete.full_name} (ID: ${id})`);
      }
    }

    if (loading) return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-white text-shadow">Students</h1>
                <button 
                  onClick={() => handleOpenModal()} 
                  className="w-full md:w-auto px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all duration-200 shadow-lg disabled:bg-gray-500/50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isModerator}
                  title={isModerator ? "You don't have permission to add students" : "Add a new student"}
                >
                    Add Student
                </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-surface/80 backdrop-blur-lg border border-white/20 shadow-glass rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-glass-lg">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-white/10 border-b border-white/20">
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-shadow">
                                Student Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-shadow">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-shadow">Enrolled On</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-shadow">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-shadow">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.id} className="border-b border-white/20 hover:bg-white/10 transition-all duration-200">
                                <td className="px-6 py-4">
                                    <Link to={`/student/${student.id}`} className="font-medium text-primary hover:underline focus:outline-none focus:underline">{student.full_name}</Link>
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                    {student.email}
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                    {new Date(student.enrollment_date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusChip status={student.status} />
                                </td>
                                <td className="px-6 py-4">
                                    <button 
                                      onClick={() => handleOpenModal(student)} 
                                      className="text-blue-400 hover:text-blue-300 mr-4 font-semibold focus:outline-none focus:underline"
                                    >
                                      Edit
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteStudent(student.id)} 
                                      className="text-red-500 hover:text-red-400 font-semibold disabled:text-gray-500 disabled:cursor-not-allowed focus:outline-none focus:underline"
                                      disabled={isModerator}
                                      title={isModerator ? "You don't have permission to delete students" : "Delete student"}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {students.map(student => (
                    <div key={student.id} className="bg-surface/80 backdrop-blur-lg border border-white/20 shadow-glass rounded-2xl p-4 space-y-2 transition-all duration-300 hover:shadow-glass-lg">
                        <div className="font-bold text-white text-lg">{student.full_name}</div>
                        <div className="text-sm text-gray-200">{student.email}</div>
                        <div className="text-sm text-gray-300">Enrolled: {new Date(student.enrollment_date).toLocaleDateString()}</div>
                        <div><StatusChip status={student.status} /></div>
                        <div className="pt-2 border-t border-white/10 flex justify-end space-x-4">
                            <button 
                              onClick={() => handleOpenModal(student)} 
                              className="text-blue-300 hover:text-blue-100 font-semibold focus:outline-none focus:underline"
                            >
                              Edit
                            </button>
                             <button 
                                onClick={() => handleDeleteStudent(student.id)} 
                                className="text-red-400 hover:text-red-200 font-semibold disabled:text-gray-500 disabled:cursor-not-allowed focus:outline-none focus:underline"
                                disabled={isModerator}
                             >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && <StudentForm student={editingStudent} onSave={handleSaveStudent} onClose={handleCloseModal} />}
        </div>
    );
};

interface StudentFormProps {
    student: Student | null;
    onSave: (studentData: Omit<Student, 'id'|'enrollment_date'>) => void;
    onClose: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onSave, onClose }) => {
    const { currentUser } = useUser();
    const isModerator = currentUser.role === 'Moderator';

    const [formData, setFormData] = useState({
        full_name: student?.full_name || '',
        email: student?.email || '',
        phone: student?.phone || '',
        status: student?.status || 'active',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Omit<Student, 'id'|'enrollment_date'>);
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={student ? 'Edit Student' : 'Add Student'}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-200 mb-1">Full Name</label>
                        <input 
                          id="full_name" 
                          type="text" 
                          name="full_name" 
                          value={formData.full_name} 
                          onChange={handleChange} 
                          className="mt-1 block w-full px-4 py-2.5 bg-white/10 border border-white/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm text-white placeholder-gray-400 transition-all duration-200" 
                          required 
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">Email</label>
                        <input 
                          id="email" 
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleChange} 
                          className="mt-1 block w-full px-4 py-2.5 bg-white/10 border border-white/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm text-white placeholder-gray-400 transition-all duration-200" 
                          required 
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-1">Phone</label>
                        <input 
                          id="phone" 
                          type="tel" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleChange} 
                          className="mt-1 block w-full px-4 py-2.5 bg-white/10 border border-white/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm text-white placeholder-gray-400 transition-all duration-200" 
                        />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-200 mb-1">Status</label>
                        <select 
                          id="status" 
                          name="status" 
                          value={formData.status} 
                          onChange={handleChange} 
                          className="mt-1 block w-full pl-4 pr-10 py-2.5 text-base bg-white/10 border-white/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm rounded-lg text-white transition-all duration-200"
                        >
                            <option className="text-black" value="active">Active</option>
                            <option className="text-black" value="inactive">Inactive</option>
                            <option className="text-black" value="suspended">Suspended</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button 
                      type="button" 
                      onClick={onClose} 
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:bg-gray-500/50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={isModerator && !student} // Disable save only for new students if moderator
                      title={isModerator && !student ? "You don't have permission to add students" : "Save changes"}
                    >
                        Save
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default StudentsPage;