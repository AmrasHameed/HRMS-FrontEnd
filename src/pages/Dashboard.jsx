import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/SideBar';
import DataTable from '../components/DataTable';
import FilterControls from '../components/FilterControls';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import AddCandidateModal from '../components/AddCandidateForm';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import EditEmployeeModal from '../components/EditEmployeeForm';
import AddLeaveModal from '../components/AddLeaveForm';
import LogoutModal from '../components/LogoutModal';
import { toast } from 'sonner';
import axiosInstance from '../services/axiosInstance';


const BACKEND_URL = 'https://hrms-backend-26st.onrender.com'

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get section from URL query params, default to 'candidates'
  const getSectionFromUrl = () => {
    const section = searchParams.get('section');
    const validSections = ['candidates', 'employees', 'attendance', 'leaves'];
    return validSections.includes(section) ? section : 'candidates';
  };

  const [activeSection, setActiveSection] = useState(getSectionFromUrl());

  const [candidates, setCandidates] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);

  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);

  // Calendar state
  const [calendarDate, setCalendarDate] = useState(new Date(Date.now())); // June 15, 2023

  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddLeaveModal, setShowAddLeaveModal] = useState(false);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Update activeSection when URL changes
  useEffect(() => {
    const urlSection = getSectionFromUrl();
    if (urlSection !== activeSection) {
      setActiveSection(urlSection);
      setSearchQuery('');
      setSelectedPosition('all');
      setSelectedStatus('all');
    }
  }, [searchParams]);

  useEffect(() => {
    if (!searchParams.get('section')) {
      setSearchParams({ section: 'candidates' });
    }
  }, []);

  const navigateToSection = (section) => {
    setActiveSection(section);
    setSearchQuery('');
    setSelectedPosition('all');
    setSelectedStatus('all');
    setSidebarOpen(false);
    setSearchParams({ section });
  };

  //get-candidate
  const fetchAllCandidates = async () => {
    try {
      const [candidateRes, employeeRes, leaves] = await Promise.all([
        axiosInstance.get('/candidates'),
        axiosInstance.get('/employees'),
        axiosInstance.get('/leaves'),
      ]);
      const transformedCandidates = candidateRes.data.map((c, index) => ({
        srNo: String(index + 1).padStart(2, '0'),
        candidatesName: c.fullName,
        emailAddress: c.emailAddress,
        phoneNumber: c.phoneNumber,
        department: c.department,
        position: c.position,
        displayPosition: `${c.department} ${c.position}`,
        status: c.status,
        experience: c.experience,
        resumeUrl: c.resumeUrl,
        id: c._id,
      }));
      const transformedEmployees = employeeRes.data.map((e, index) => ({
        srNo: String(index + 1 + transformedCandidates.length).padStart(2, '0'),
        employeeName: e.fullName,
        emailAddress: e.emailAddress,
        phoneNumber: e.phoneNumber,
        department: e.department,
        position: e.position,
        dateOfJoining: e.dateOfJoining,
        status: e.attendanceStatus || null,
        id: e._id,
        isEmployee: e.isEmployee,
      }));
      const transformedAttendance = employeeRes.data.map((e, index) => ({
        employeeName: e.fullName,
        emailAddress: e.emailAddress,
        phoneNumber: e.phoneNumber,
        department: e.department,
        position: e.position,
        status: e.attendanceStatus,
        task: 'HRMS Development',
        id: e._id,
        isEmployee: e.isEmployee,
      }));
      const transformedLeaves = leaves.data.map((e, index) => ({
        profileImage: './profile.jpg',
        name: e.employeeName,
        date: e.leaveDate,
        reason: e.reason,
        status: e.status,
        docs: e.documents,
        id: e._id,
      }));
      return {
        candidates: transformedCandidates,
        employees: transformedEmployees,
        attendance: transformedAttendance,
        leaves: transformedLeaves,
      };
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  };

  useEffect(() => {
    const getCandidates = async () => {
      try {
        const { candidates, employees, attendance, leaves } =
          await fetchAllCandidates();
        setCandidates(candidates);
        setEmployees(employees);
        setAttendance(attendance);
        setLeaves(leaves);
      } catch (error) {
        console.error('Failed to load candidates');
      }
    };

    getCandidates();
  }, []);

  //add-candidate

  const handleAddCandidate = async (candidateData) => {
    try {
      const formData = new FormData();
      formData.append('fullName', candidateData.fullName);
      formData.append('emailAddress', candidateData.emailAddress);
      formData.append('phoneNumber', candidateData.phoneNumber);
      formData.append('position', candidateData.position);
      formData.append('department', candidateData.department);
      formData.append('experience', candidateData.experience);
      formData.append('status', 'New');
      formData.append('resume', candidateData.resume);
      const { data } = await axiosInstance.post(
        '/candidates/addCandidate',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (data.msg === 'success') {
        const newCandidate = {
          srNo: String(candidates.length + 1).padStart(2, '0'),
          candidatesName: data.fullName || candidateData.fullName,
          emailAddress: data.emailAddress || candidateData.emailAddress,
          phoneNumber: data.phoneNumber || candidateData.phoneNumber,
          position: data.position || candidateData.position,
          department: data.department || candidateData.department,
          displayPosition: candidateData.displayPosition,
          status: data.status || 'New',
          experience: data.experience || candidateData.experience,
          id: data.id,
          resumeUrl: data.resumeUrl,
        };
        setCandidates([...candidates, newCandidate]);
        console.log('Candidate added successfully:', data);
        toast.success('Candidate added successfully!');
      }
    } catch (error) {
      console.error('Error adding candidate:', error);
      if (error.response) {
        const errorMessage =
          error.response.data?.message || 'Failed to add candidate';
        console.error('Server error:', errorMessage);
        toast.error(`Error: ${errorMessage}`);
      } else if (error.request) {
        console.error('Network error:', error.request);
        toast.error('Network error. Please check your connection.');
      } else {
        console.error('Error:', error.message);
        toast.error('An unexpected error occurred.');
      }
    }
  };

  //candidate-status

  const handleCandidateStatusChange = async (
    rowIndex,
    newStatus,
    candidate
  ) => {
    try {
      const { data } = await axiosInstance.patch(
        `/candidates/${candidate.id}`,
        {
          status: newStatus,
        }
      );
      if (data.msg === 'success') {
        const updatedCandidates = candidates.map((c) =>
          c.id === candidate.id ? { ...c, status: newStatus } : c
        );
        setCandidates(updatedCandidates);
        toast.success(`Candidate status updated to ${newStatus}`);
        console.log('Candidate status updated:', data);
      }
    } catch (error) {
      console.error('Error updating candidate status:', error);
      if (error.response) {
        const errorMessage =
          error.response.data?.message || 'Failed to update candidate status';
        toast.error(`Error: ${errorMessage}`);
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  //edit-employee

  const handleUpdateEmployee = async (values) => {
    try {
      const [year, month, day] = values.dateOfJoining.split('-');
      const formattedDate = `${day}-${month}-${year}`;
      const updatedData = {
        employeeName: values.fullName,
        emailAddress: values.emailAddress,
        phoneNumber: values.phoneNumber,
        position: values.position,
        department: values.department,
        dateOfJoining: formattedDate,
      };

      const { data } = await axiosInstance.put(
        `/employees/${selectedEmployee.id}`,
        updatedData
      );

      if (data.msg === 'success') {
        const updatedEmployees = employees.map((emp) =>
          emp.emailAddress === selectedEmployee.emailAddress
            ? { ...emp, ...updatedData }
            : emp
        );
        setEmployees(updatedEmployees);
        toast.success('Employee updated successfully!');
      } else {
        toast.error('Failed to update employee. Please try again.');
      }

      console.log('Employee updated:', values);
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('An error occurred while updating the employee.');
    }
  };

  //edit-employee-status

  const handleAttendanceStatusChange = async (
    rowIndex,
    newStatus,
    employee
  ) => {
    try {
      const { data } = await axiosInstance.patch(`/employees/${employee.id}`, {
        attendanceStatus: newStatus,
      });
      if (data.msg === 'success') {
        const updatedAttendance = attendance.map((emp) => {
          return emp.id === employee.id ? { ...emp, status: newStatus } : emp;
        });

        setAttendance(updatedAttendance);
        toast.success(
          `${employee.employeeName}'s attendance updated to ${newStatus}`
        );
        console.log('Attendance status updated:', {
          employee: employee.employeeName,
          status: newStatus,
        });
      } else {
        toast.error('Failed to update attendance status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating attendance status:', error);
      if (error.response) {
        const errorMessage =
          error.response.data?.message || 'Failed to update attendance status';
        toast.error(`Error: ${errorMessage}`);
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  //add-leaves

  const handleAddLeave = async (values) => {
    try {
      const formData = new FormData();
      formData.append('employeeName', values.employeeName);
      formData.append('leaveDate', values.leaveDate);
      formData.append('reason', values.reason);
      formData.append('status', 'Pending');
      formData.append('designation', values.designation);
      formData.append('documents', values.documents);
      formData.append('employeeId', values.employeeId);
      const { data } = await axiosInstance.post('/leaves/addLeave', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.msg === 'success') {
        const newLeave = {
          profileImage: '/profile.jpg',
          name: data.newLeave.employeeName,
          date: data.newLeave.leaveDate,
          reason: data.newLeave.reason,
          status: data.newLeave.status,
          docs: data.newLeave.documents,
          id: data._id,
        };
        setLeaves([...leaves, newLeave]);
        toast.success('Leave added successfully!');
        console.log('New leave added:', newLeave);
      } else {
        toast.error('Failed to add leave. Please try again.');
      }
    } catch (error) {
      console.error('Error adding leave:', error);
      if (error.response) {
        const errorMessage =
          error.response.data?.message || 'Failed to add leave';
        toast.error(`Error: ${errorMessage}`);
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  //edit-leave-status

  const handleLeaveStatusChange = async (rowIndex, newStatus, leave) => {
    try {
      console.log(leave)
      const { data } = await axiosInstance.patch(`/leaves/${leave.id}`, {
        status: newStatus,
      });

      if (data.msg === 'success') {
        const updatedLeaves = leaves.map((item) =>
          item._id === leave._id ? { ...item, status: newStatus } : item
        );

        setLeaves(updatedLeaves);

        toast.success(
          `${leave?.name}'s leave status updated to ${newStatus}`
        );
        console.log('Leave status updated:', {
          employee: leave.employeeName,
          status: newStatus,
        });
      } else {
        toast.error('Failed to update leave status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating leave status:', error);
      if (error.response) {
        const errorMessage =
          error.response.data?.message || 'Failed to update leave status';
        toast.error(`Error: ${errorMessage}`);
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  //candidates-filter

  useEffect(() => {
    let filtered = candidates;

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(
        (candidate) =>
          candidate.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    if (selectedPosition !== 'all') {
      filtered = filtered.filter((candidate) =>
        candidate.displayPosition
          .toLowerCase()
          .includes(selectedPosition.toLowerCase())
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (candidate) =>
          candidate.candidatesName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          candidate.emailAddress
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          candidate.displayPosition
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          candidate.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCandidates(filtered);
  }, [candidates, selectedStatus, selectedPosition, searchQuery]);

  //employees-filter

  useEffect(() => {
    let filtered = employees;

    if (selectedPosition !== 'all') {
      filtered = filtered.filter((employee) =>
        employee.position.toLowerCase().includes(selectedPosition.toLowerCase())
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (employee) =>
          employee.employeeName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          employee.emailAddress
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEmployees(filtered);
  }, [employees, selectedPosition, searchQuery]);

  //attendance-filter

  useEffect(() => {
    let filtered = attendance;

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(
        (record) => record.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (record) =>
          record.employeeName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          record.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.task.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAttendance(filtered);
  }, [attendance, selectedStatus, searchQuery]);

  //leaves-filter

  useEffect(() => {
    let filtered = leaves;

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(
        (record) => record.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (record) =>
          record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.reason.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredLeaves(filtered);
  }, [leaves, selectedStatus, searchQuery]);

  //calendar-count

  const parseDDMMYYYY = (dateStr) => {
    const [dd, mm, yyyy] = dateStr.split('-');
    return new Date(`${yyyy}-${mm}-${dd}`);
  };

  const getApprovedLeavesForDate = (date) => {
    return leaves.filter((leave) => {
      if (leave?.status?.toLowerCase() === 'approved') {
        const dateRange = leave.date.split(' to ');
        const startDate = parseDDMMYYYY(dateRange[0].trim());
        const endDate =
          dateRange.length > 1 ? parseDDMMYYYY(dateRange[1].trim()) : startDate;

        // Normalize all dates to ignore time
        const checkDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );
        const leaveStart = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate()
        );
        const leaveEnd = new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate()
        );

        return checkDate >= leaveStart && checkDate <= leaveEnd;
      }
      return false;
    });
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const absenteeCount = getApprovedLeavesForDate(date).length;
      if (absenteeCount > 0) {
        return <div className="absentee-indicator">{absenteeCount}</div>;
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const absenteeCount = getApprovedLeavesForDate(date).length;
      if (absenteeCount > 0) {
        return 'has-absentees';
      }
    }
    return null;
  };

  //logout

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast.success('User Logged Out Successfully');
    setShowLogoutModal(false);
    setSidebarOpen(false);
  };

  //sidebar

  const sidebarSections = useMemo(
    () => [
      {
        title: 'Recruitment',
        items: [
          {
            id: 'candidates',
            label: 'Candidates',
            icon: './candidates.svg',
            icon2: './candidates-2.svg',
            active: activeSection === 'candidates',
            onClick: () => navigateToSection('candidates'),
          },
        ],
      },
      {
        title: 'Organization',
        items: [
          {
            id: 'employees',
            label: 'Employees',
            icon: './employees.svg',
            icon2: './employees-2.svg',
            active: activeSection === 'employees',
            onClick: () => navigateToSection('employees'),
          },
          {
            id: 'attendance',
            label: 'Attendance',
            icon: './attendance.svg',
            icon2: './attendance-2.svg',
            active: activeSection === 'attendance',
            onClick: () => navigateToSection('attendance'),
          },
          {
            id: 'leaves',
            label: 'Leaves',
            icon: './leaves.svg',
            icon2: './leaves-2.svg',
            active: activeSection === 'leaves',
            onClick: () => navigateToSection('leaves'),
          },
        ],
      },
      {
        title: 'Others',
        items: [
          {
            id: 'logout',
            label: 'Logout',
            icon: './logout.svg',
            icon2: './logout-2.svg',
            active: false,
            onClick: () => {
              setShowLogoutModal(true);
              setSidebarOpen(false);
            },
          },
        ],
      },
    ],
    [activeSection]
  );

  const candidatesColumns = [
    { key: 'srNo', label: 'Sr no.', width: '80px' },
    { key: 'candidatesName', label: 'Candidates Name', width: '200px' },
    { key: 'emailAddress', label: 'Email Address', width: '250px' },
    { key: 'phoneNumber', label: 'Phone Number', width: '150px' },
    { key: 'displayPosition', label: 'Position', width: '200px' },
    { key: 'status', label: 'Status', width: '120px' },
    { key: 'experience', label: 'Experience', width: '100px' },
  ];

  const employeesColumns = [
    { key: 'profileImage', label: 'Profile Image', width: '80px' },
    { key: 'employeeName', label: 'Employee Name', width: '180px' },
    { key: 'emailAddress', label: 'Email Address', width: '220px' },
    { key: 'phoneNumber', label: 'Phone Number', width: '150px' },
    { key: 'position', label: 'Position', width: '180px' },
    { key: 'department', label: 'Department', width: '180px' },
    { key: 'dateOfJoining', label: 'Date of Joining', width: '120px' },
  ];

  const attendanceColumns = [
    { key: 'profileImage', label: 'Profile Image', width: '80px' },
    { key: 'employeeName', label: 'Employee Name', width: '200px' },
    { key: 'position', label: 'Position', width: '180px' },
    { key: 'department', label: 'Department', width: '180px' },
    { key: 'task', label: 'Task', width: '220px' },
    { key: 'status', label: 'Status', width: '120px' },
  ];

  const leavesColumns = [
    { key: 'profileImage', label: 'Profile', width: '60px' },
    { key: 'name', label: 'Name', width: '150px' },
    { key: 'date', label: 'Date', width: '120px' },
    { key: 'reason', label: 'Reason', width: '150px' },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (row, rowIndex, onStatusChange) => (
        <select
          value={row.status}
          onChange={(e) => {
            onStatusChange(rowIndex, e.target.value, row);
          }}
          className={`status-dropdown ${row.status.toLowerCase()}`}
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      ),
    },
    { key: 'docs', label: 'Docs', width: '80px' },
  ];

  const candidateActions = [
    {
      label: 'Download Resume',
      onClick: async (row) => {
        try {
          console.log(row.resumeUrl);
          if (row.resumeUrl) {
            const fileUrl = `${BACKEND_URL}${
              row.resumeUrl
            }`;
            window.open(fileUrl, '_blank');
            toast.success('Resume opened in new tab');
          } else {
            toast.error('No resume available for this candidate');
          }
        } catch (error) {
          console.error('Error downloading resume:', error);
          toast.error('Failed to download resume. Please try again later.');
        }
      },
    },
    {
      label: 'Delete Candidate',
      onClick: async (row) => {
        try {
          const isConfirmed = window.confirm(
            `Are you sure you want to delete ${row.candidatesName}? This action cannot be undone.`
          );
          if (!isConfirmed) {
            return;
          }
          const { data } = await axiosInstance.delete(`/candidates/${row.id}`);
          if (data.msg === 'success') {
            const updatedCandidates = candidates.filter((c) => c.id !== row.id);
            setCandidates(updatedCandidates);
            toast.success(
              `${row.candidatesName} has been deleted successfully`
            );
            console.log('Candidate deleted successfully:', row);
          }
        } catch (error) {
          console.error('Error deleting candidate:', error);
          if (error.response) {
            const errorMessage =
              error.response.data?.message || 'Failed to delete candidate';
            console.error('Server error:', errorMessage);
            toast.error(`Error: ${errorMessage}`);
          } else if (error.request) {
            console.error('Network error:', error.request);
            toast.error('Network error. Please check your connection.');
          } else {
            console.error('Error:', error.message);
            toast.error(
              'An unexpected error occurred while deleting the candidate.'
            );
          }
        }
      },
      variant: 'danger',
    },
  ];

  const employeeActions = [
    {
      label: 'Edit',
      onClick: (row) => {
        setSelectedEmployee(row);
        setShowEditEmployeeModal(true);
      },
    },
    {
      label: 'Delete',
      onClick: async (row) => {
        try {
          const isConfirmed = window.confirm(
            `Are you sure you want to delete ${row.employeeName}? This action cannot be undone.`
          );
          if (!isConfirmed) {
            return;
          }
          const { data } = await axiosInstance.delete(`/employees/${row.id}`);
          if (data.msg === 'success') {
            const updatedEmployees = employees.filter((c) => c.id !== row.id);
            setEmployees(updatedEmployees);
            toast.success(`${row.employeeName} has been deleted successfully`);
            console.log('Candidate deleted successfully:', row);
          }
        } catch (error) {
          console.error('Error deleting candidate:', error);
          if (error.response) {
            const errorMessage =
              error.response.data?.message || 'Failed to delete candidate';
            console.error('Server error:', errorMessage);
            toast.error(`Error: ${errorMessage}`);
          } else if (error.request) {
            console.error('Network error:', error.request);
            toast.error('Network error. Please check your connection.');
          } else {
            console.error('Error:', error.message);
            toast.error(
              'An unexpected error occurred while deleting the candidate.'
            );
          }
        }
      },
      variant: 'danger',
    },
  ];

  const noActions = [];

  const statusOptionsBySection = {
    candidates: [
      { value: 'all', label: 'Status' },
      { value: 'new', label: 'New' },
      { value: 'scheduled', label: 'Scheduled' },
      { value: 'ongoing', label: 'Ongoing' },
      { value: 'selected', label: 'Selected' },
      { value: 'rejected', label: 'Rejected' },
    ],
    attendance: [
      { value: 'all', label: 'Status' },
      { value: 'present', label: 'Present' },
      { value: 'absent', label: 'Absent' },
      { value: 'medical leave', label: 'Medical Leave' },
      { value: 'work from home', label: 'Work From Home' },
    ],
    leaves: [
      { value: 'all', label: 'Status' },
      { value: 'pending', label: 'Pending' },
      { value: 'approved', label: 'Approved' },
      { value: 'rejected', label: 'Rejected' },
    ],
  };

  const positionOptions = [
    { value: 'all', label: 'Position' },
    { value: 'Intern', label: 'Intern' },
    { value: 'Full Time', label: 'Full Time' },
    { value: 'Junior', label: 'Junior' },
    { value: 'Senior', label: 'Senior' },
    { value: 'Team Lead', label: 'Team Lead' },
  ];

  const getActiveTitle = () => {
    switch (activeSection) {
      case 'candidates':
        return 'Candidates';
      case 'employees':
        return 'Employees';
      case 'attendance':
        return 'Attendance';
      case 'leaves':
        return 'Leaves';
      default:
        return 'Dashboard';
    }
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'candidates':
        return (
          <>
            <FilterControls
              statusOptions={statusOptionsBySection.candidates}
              positionOptions={positionOptions}
              selectedStatus={selectedStatus}
              selectedPosition={selectedPosition}
              searchQuery={searchQuery}
              onStatusChange={setSelectedStatus}
              onPositionChange={setSelectedPosition}
              onSearchChange={setSearchQuery}
              onAddCandidate={() => setShowAddCandidateModal(true)}
              addButtonText="Add Candidate"
            />
            <DataTable
              columns={candidatesColumns}
              data={filteredCandidates}
              actions={candidateActions}
              onRowClick={(row) => console.log('Candidate clicked:', row)}
              onStatusChange={handleCandidateStatusChange}
            />
          </>
        );
      case 'employees':
        return (
          <>
            <FilterControls
              positionOptions={positionOptions}
              selectedPosition={selectedPosition}
              searchQuery={searchQuery}
              onPositionChange={setSelectedPosition}
              onSearchChange={setSearchQuery}
            />
            <DataTable
              columns={employeesColumns}
              data={filteredEmployees}
              actions={employeeActions}
              onRowClick={(row) => console.log('Employee clicked:', row)}
            />
          </>
        );
      case 'attendance':
        return (
          <>
            <FilterControls
              statusOptions={statusOptionsBySection.attendance}
              selectedStatus={selectedStatus}
              searchQuery={searchQuery}
              onStatusChange={setSelectedStatus}
              onSearchChange={setSearchQuery}
            />
            <DataTable
              columns={attendanceColumns}
              data={filteredAttendance}
              actions={noActions}
              onRowClick={(row) =>
                console.log('Attendance record clicked:', row)
              }
              onStatusChange={handleAttendanceStatusChange}
            />
          </>
        );
      case 'leaves':
        return (
          <>
            <FilterControls
              statusOptions={statusOptionsBySection.leaves}
              selectedStatus={selectedStatus}
              searchQuery={searchQuery}
              onStatusChange={setSelectedStatus}
              onSearchChange={setSearchQuery}
              onAddCandidate={() => setShowAddLeaveModal(true)}
              addButtonText="Add Leave"
            />
            <div className="leaves-container">
              <div className="applied-leaves">
                <div className="leaves-table-container">
                  <DataTable
                    columns={leavesColumns}
                    data={filteredLeaves}
                    actions={[]}
                    onRowClick={(row) =>
                      console.log('Leave record clicked:', row)
                    }
                    onStatusChange={(rowIndex, newStatus, leave) => {
                      handleLeaveStatusChange(rowIndex, newStatus, leave);
                    }}
                  />
                </div>
              </div>

              <div className="leave-calendar">
                <div className="section-header">
                  <h3>Leave Calendar</h3>
                </div>
                <div className="calendar-container">
                  <Calendar
                    value={calendarDate}
                    onChange={setCalendarDate}
                    tileContent={tileContent}
                    tileClassName={tileClassName}
                    showNeighboringMonth={false}
                    prev2Label={null}
                    next2Label={null}
                    formatShortWeekday={(locale, date) => {
                      const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                      return weekdays[date.getDay()];
                    }}
                  />

                  <div className="approved-leaves-list">
                    <h5>Approved Leaves</h5>
                    {leaves
                      .filter(
                        (leave) => leave?.status?.toLowerCase() === 'approved'
                      )
                      .map((leave, index) => (
                        <div key={index} className="approved-leave-item">
                          <img src={'./profile.jpg'} alt="Profile" />
                          <div className="leave-info">
                            <div className="leave-name">{leave.name}</div>
                            {/* <div className="leave-title">Senior Backend Developer</div> */}
                          </div>
                          <div className="leave-date">
                            {leave.date.split(' ')[0]}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      {sidebarOpen && (
        <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="dashboard-content">
        <Sidebar
          sections={sidebarSections}
          onSearch={(query) => console.log('Sidebar search:', query)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="right-section">
          <Header
            title={getActiveTitle()}
            userName="John Doe"
            userEmail="john.doe@example.com"
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="main-content">{renderSectionContent()}</main>
        </div>
      </div>
      <AddCandidateModal
        isOpen={showAddCandidateModal}
        onClose={() => setShowAddCandidateModal(false)}
        onSubmit={handleAddCandidate}
      />
      <EditEmployeeModal
        isOpen={showEditEmployeeModal}
        onClose={() => setShowEditEmployeeModal(false)}
        onSubmit={handleUpdateEmployee}
        employee={selectedEmployee}
      />
      <AddLeaveModal
        isOpen={showAddLeaveModal}
        onClose={() => setShowAddLeaveModal(false)}
        onSubmit={handleAddLeave}
        employees={attendance}
      />

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      <style>{`
        .dashboard {
          min-height: 100vh;
          background-color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .dashboard-content {
          display: flex;
          height: 100vh;
          position: relative;
        }

        .right-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0; /* Prevents flex item from overflowing */
        }

        .main-content {
          flex: 1;
          padding: 12px 24px 24px 24px;
          overflow-y: auto;
          overflow-x: auto;
        }

        .mobile-overlay {
          display: none;
        }

        .leaves-container {
          display: flex;
          gap: 20px;
          // height: 100%;
        }

        .applied-leaves {
          flex: 2;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .leave-calendar {
          flex: 1;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          min-width: 320px;
        }

        .absentee-indicator {
          margin-left: 20px;
          width: 16px;
          height: 16px;
          background-color: #4d007d;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
          z-index: 1;
        }

        .section-header {
          background: #4d007d;
          color: white;
          padding: 16px 20px;
        }

        .section-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .table-container {
          overflow-x: auto;
        }

        @media (max-width: 1024px) {
          .leaves-container {
            flex-direction: column;
          }
          
          .leave-calendar {
            min-width: 100%;
          }
        }

.approved-leaves-list {
  border-top: 1px solid #e2e8f0;
  padding: 10px;
  margin-top: 20px;
}

.approved-leaves-list h5 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #4d007d;
}

.approved-leave-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.approved-leave-item img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.leave-info {
  flex: 1;
}

.leave-name {
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 2px;
}

.leave-title {
  font-size: 11px;
  color: #64748b;
}

.leave-date {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}
`}</style>
    </div>
  );
}
