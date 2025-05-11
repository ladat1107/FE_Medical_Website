/** @type {import('tailwindcss').Config} */
import scrollbar from 'tailwind-scrollbar';
export default {
  content: [
    "./src/layout/Receptionist/pages/Messenger/**/*.{js,jsx,ts,tsx}",
    "./src/layout/Admin/pages/MedicineManage/**/*.{js,jsx,ts,tsx}",
    "./src/layout/Admin/pages/ExaminationManage/**/*.{js,jsx,ts,tsx}",
    "./src/layout/Receptionist/pages/Dashboard/**/*.{js,jsx,ts,tsx}",
    "./src/layout/Receptionist/components/AddUserModal/**/*.{js,jsx,ts,tsx}",
    "./src/layout/User/pages/DoctorList/**/*.{js,jsx,ts,tsx}",
    "./src/components/Header/**/*.{js,jsx,ts,tsx}",
    "./src/layout/User/pages/DoctorDetail/**/*.{js,jsx,ts,tsx}",
    "./src/components/DoctorCard/**/*.{js,jsx,ts,tsx}",
    "./src/layout/User/pages/DepartmentDetail/**/*.{js,jsx,ts,tsx}",
    "./src/layout/User/pages/DepartmentList/**/*.{js,jsx,ts,tsx}",
    "./src/components/Footer/**/*.{js,jsx,ts,tsx}",
    "./src/layout/User/pages/BlogList/**/*.{js,jsx,ts,tsx}",
    "./src/components/HandbookItem/HandbookCard/**/*.{js,jsx,ts,tsx}",
    "./src/components/BigBlog/**/*.{js,jsx,ts,tsx}",
    "./src/layout/User/pages/BlogDetail/**/*.{js,jsx,ts,tsx}",
    "./src/layout/User/pages/Instruction/**/*.{js,jsx,ts,tsx}",
    "./src/layout/User/pages/Home/**/*.{js,jsx,ts,tsx}",
    "./src/layout/User/pages/AppointmentList/**/*.{js,jsx,ts,tsx}",
    "./src/layout/User/pages/Notification/**/*.{js,jsx,ts,tsx}",
    "./src/layout/User/pages/Login/**/*.{js,jsx,ts,tsx}",
    "./src/layout/User/pages/ProfileUser/**/*.{js,jsx,ts,tsx}",
    "./src/components/Profile/**/*.{js,jsx,ts,tsx}",
    "./src/layout/Admin/components/Tooltip/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-tw': '#00B5F1',
        'secondary-tw': '#3dac78',
        'background-tw': '#f4f4f4',
        'mainText-tw': '#00B5F1',
        'secondaryText-tw': '#003553',
        'bgAdmin': '#f3f4f6',
        'bgHomePage': '#E8F2F7',
        'bgTableHead': '#dceff8',
        'textHeadTable': '#007BFF',
        'hoverTable': '#edf3fc',
        'evenRow': '#EEF5FF',
        'gradient-primary': 'linear-gradient(36deg, #00b5f1, #00e0ff)',
      },
      borderRadius: {
        'bg-admin': '10px',
        'table-admin': '8px',
      },
      boxShadow: {
        'table-admin': '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'card-doctor': '0px 4px 12px rgba(192, 202, 214, 0.35)',
      },
      keyframes: {
        slideInRight: {
          '0%': { opacity: 0, transform: 'translateX(100%)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      },
      animation: {
        slideInRight: 'slideInRight 1.5s ease-out forwards',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(36deg, #00b5f1, #00e0ff)',
      },
    },
  },
  plugins: [scrollbar],
}

