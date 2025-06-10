import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
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

const sampleCandidates = [
  {
    srNo: "01",
    candidatesName: "Jacob William",
    emailAddress: "jacob.william@example.com",
    phoneNumber: "(252) 555-0111",
    department: "Software Development",
    position: "Senior",
    displayPosition: "Software Development Senior",
    status: "New",
    experience: "1+",
  },
  {
    srNo: "02",
    candidatesName: "Guy Hawkins",
    emailAddress: "kenzi.lawson@example.com",
    phoneNumber: "(907) 555-0101",
    department: "Human Resources",
    position: "Full Time",
    displayPosition: "Human Resources Full Time",
    status: "New",
    experience: "2+",
  },
  {
    srNo: "03",
    candidatesName: "Arlene McCoy",
    emailAddress: "arlene.mccoy@example.com",
    phoneNumber: "(302) 555-0107",
    department: "Design",
    position: "Full Time",
    displayPosition: "Design Full Time",
    status: "Selected",
    experience: "3+",
  },
  {
    srNo: "04",
    candidatesName: "Leslie Alexander",
    emailAddress: "willie.jennings@example.com",
    phoneNumber: "(207) 555-0119",
    department: "Software Development",
    position: "Full Time",
    displayPosition: "Software Development Full Time",
    status: "Rejected",
    experience: "0",
  },
]

const sampleEmployees = [
  {
    profileImage: '/placeholder.svg?height=40&width=40',
    employeeName: 'Robert Smith',
    emailAddress: 'robert.smith@example.com',
    phoneNumber: '(301) 555-6789',
    position: 'Frontend Developer',
    department: 'Engineering',
    dateOfJoining: '2022-04-15',
  },
  {
    profileImage: '/placeholder.svg?height=40&width=40',
    employeeName: 'Sarah Johnson',
    emailAddress: 'sarah.johnson@example.com',
    phoneNumber: '(406) 555-3412',
    position: 'UI/UX Designer',
    department: 'Design',
    dateOfJoining: '2021-11-02',
  },
  {
    profileImage: '/placeholder.svg?height=40&width=40',
    employeeName: 'Michael Chen',
    emailAddress: 'michael.chen@example.com',
    phoneNumber: '(512) 555-9876',
    position: 'Backend Developer',
    department: 'Engineering',
    dateOfJoining: '2023-01-10',
  },
  {
    profileImage: '/placeholder.svg?height=40&width=40',
    employeeName: 'Alicia Rodriguez',
    emailAddress: 'alicia.rodriguez@example.com',
    phoneNumber: '(702) 555-4321',
    position: 'HR Manager',
    department: 'Human Resources',
    dateOfJoining: '2021-08-22',
  },
];

const sampleAttendance = [
  {
    profileImage: '/placeholder.svg?height=40&width=40',
    employeeName: 'Robert Smith',
    position: 'Frontend Developer',
    department: 'Engineering',
    task: 'Homepage redesign',
    status: 'Medical Leave',
  },
  {
    profileImage: '/placeholder.svg?height=40&width=40',
    employeeName: 'Sarah Johnson',
    position: 'UI/UX Designer',
    department: 'Design',
    task: 'User research',
    status: 'Absent',
  },
  {
    profileImage: '/placeholder.svg?height=40&width=40',
    employeeName: 'Michael Chen',
    position: 'Backend Developer',
    department: 'Engineering',
    task: 'API development',
    status: 'Present',
  },
  {
    profileImage: '/placeholder.svg?height=40&width=40',
    employeeName: 'Alicia Rodriguez',
    position: 'HR Manager',
    department: 'Human Resources',
    task: 'Recruitment process',
    status: 'Work From Home',
  },
];

const sampleLeaves = [
  {
    profileImage: '/placeholder.svg?height=40&width=40',
    name: 'Robert Smith',
    date: '2023-06-15 ',
    reason: 'Family vacation',
    status: 'Approved',
    docs: 'vacation-request.pdf',
  },
  {
    profileImage: '/placeholder.svg?height=40&width=40',
    name: 'Sarah Johnson',
    date: '2023-06-22',
    reason: 'Medical appointment',
    status: 'Pending',
    docs: 'medical-note.pdf',
  },
  {
    profileImage: '/placeholder.svg?height=40&width=40',
    name: 'Michael Chen',
    date: '2023-07-01',
    reason: 'Personal leave',
    status: 'Approved',
    docs: '',
  },
  {
    profileImage: '/placeholder.svg?height=40&width=40',
    name: 'Alicia Rodriguez',
    date: '2023-06-30',
    reason: 'Family emergency',
    status: 'Rejected',
    docs: 'emergency-form.pdf',
  },
];

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

  const [candidates, setCandidates] = useState(sampleCandidates);
  const [employees, setEmployees] = useState(sampleEmployees);
  const [attendance, setAttendance] = useState(sampleAttendance);
  const [leaves, setLeaves] = useState(sampleLeaves);

  const [filteredCandidates, setFilteredCandidates] =
    useState(sampleCandidates);
  const [filteredEmployees, setFilteredEmployees] = useState(sampleEmployees);
  const [filteredAttendance, setFilteredAttendance] =
    useState(sampleAttendance);
  const [filteredLeaves, setFilteredLeaves] = useState(sampleLeaves);

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

  //add-candidate

  const handleAddCandidate = async (candidateData) => {
    try {
      const formData = new FormData()
      formData.append("fullName", candidateData.fullName)
      formData.append("emailAddress", candidateData.emailAddress)
      formData.append("phoneNumber", candidateData.phoneNumber)
      formData.append("position", candidateData.position)
      formData.append("department", candidateData.department)
      formData.append("experience", candidateData.experience)
      formData.append("status", "New")
      formData.append("resume", candidateData.resume)
      const {data} = await axiosInstance.post("/candidates", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
      if(data.msg === 'success') {
        const newCandidate = {
          srNo: String(candidates.length + 1).padStart(2, "0"),
          candidatesName: data.fullName || candidateData.fullName,
          emailAddress: data.emailAddress || candidateData.emailAddress,
          phoneNumber: data.phoneNumber || candidateData.phoneNumber,
          position: data.position || candidateData.position,
          department: data.department || candidateData.department,
          displayPosition: data.displayPosition || candidateData.displayPosition,
          status: data.status || "New",
          experience: data.experience || candidateData.experience,
          id: data.id,
          resumeUrl: data.resumeUrl,
        }
        setCandidates([...candidates, newCandidate])
        console.log("Candidate added successfully:", response.data)
        toast.success("Candidate added successfully!")
      }
    } catch (error) {
      console.error("Error adding candidate:", error)
      if (error.response) {
        const errorMessage = error.response.data?.message || "Failed to add candidate"
        console.error("Server error:", errorMessage)
        toast.error(`Error: ${errorMessage}`)
      } else if (error.request) {
        console.error("Network error:", error.request)
        toast.error("Network error. Please check your connection.")
      } else {
        console.error("Error:", error.message)
        toast.error("An unexpected error occurred.")
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
        candidate.displayPosition.toLowerCase().includes(selectedPosition.toLowerCase()),
      )
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
          candidate.displayPosition.toLowerCase().includes(searchQuery.toLowerCase()) ||
          candidate.department.toLowerCase().includes(searchQuery.toLowerCase()),
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

  const getApprovedLeavesForDate = (date) => {
    return leaves.filter((leave) => {
      if (leave.status.toLowerCase() === 'approved') {
        const dateRange = leave.date.split(' to ');
        const startDate = new Date(dateRange[0]);
        const endDate =
          dateRange.length > 1 ? new Date(dateRange[1]) : startDate;

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
      onClick: (row) => console.log('Download resume for', row.candidatesName),
    },
    {
      label: 'Delete Candidate',
      onClick: (row) => {
        setCandidates(candidates.filter((c) => c.srNo !== row.srNo));
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
      onClick: (row) => {
        setEmployees(
          employees.filter((e) => e.emailAddress !== row.emailAddress)
        );
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

  const handleUpdateEmployee = (values) => {
    const updatedEmployees = employees.map((emp) => {
      if (emp.emailAddress === selectedEmployee.emailAddress) {
        return {
          ...emp,
          employeeName: values.fullName,
          emailAddress: values.emailAddress,
          phoneNumber: values.phoneNumber,
          position: values.position,
          department: values.department,
          dateOfJoining: values.dateOfJoining,
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    console.log('Employee updated:', values);
  };

  const handleAddLeave = (values) => {
    const newLeave = {
      profileImage: '/placeholder.svg?height=40&width=40',
      name: values.employeeName,
      date: values.leaveDate,
      reason: values.reason,
      status: 'Pending',
      docs: values.documents ? values.documents.name : '',
    };

    setLeaves([...leaves, newLeave]);
    console.log('New leave added:', newLeave);
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
                    onStatusChange={(rowIndex, newStatus, row) => {
                      const updatedLeaves = leaves.map((leave) =>
                        leave.name === row.name && leave.date === row.date
                          ? { ...leave, status: newStatus }
                          : leave
                      );
                      setLeaves(updatedLeaves);
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
                        (leave) => leave.status.toLowerCase() === 'approved'
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
        employees={employees}
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
