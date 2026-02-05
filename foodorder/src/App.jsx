// 

// src/App.jsx

import React from 'react'
import {Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import './index.css'
import Login from './pages/Login'
import DeliveryRegister from './pages/DeliveryRegister'
import DeliveryDashboard from './pages/DeliveryDashboard'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  // If no user or token, redirect to login
  if (!user || !token) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  }

  // Try to decode token payload and check expiry (exp is in seconds)
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token');
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      // token expired
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return <Navigate to="/login" />;
    }
  } catch (err) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  }

  const parsedUser = JSON.parse(user);
  if (allowedRole && parsedUser.role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
  
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/delivery-register" element={<DeliveryRegister />} />
          
          {/* User Route */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          
          {/* Delivery Route */}
          <Route 
            path="/delivery-dashboard" 
            element={
              <ProtectedRoute allowedRole="delivery">
                <DeliveryDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
        
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
   
  )
}

export default App

// import './App.css'
// import Home from './pages/Home.jsx'
// import Login from "./pages/Login.jsx"
// import Signup from "./pages/Signup.jsx"
// import {  Routes, Route,  } from "react-router-dom";
// function App() {


//   return (
//       //useRoutes hook to define application routes
//     <>
//         <Routes>
//           <Route path='/' element={<Signup />} />//first register
//           <Route path='/login' element={<Login />} />//then login
//           <Route path='/home/*' element={<Home />} />//then the main app
//         </Routes>
      
//     </>
//   )
// }

// export default App
// 
// import React, { useState } from 'react';
// import { Users, Briefcase, TrendingUp, FileText, Settings, LogOut, Plus, Search, Filter, MoreVertical, Eye, Edit, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';

// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [showAddJob, setShowAddJob] = useState(false);

//   const stats = [
//     { label: 'Total Users', value: '2,847', change: '+12.5%', icon: Users, color: 'from-blue-500 to-cyan-500' },
//     { label: 'Active Jobs', value: '143', change: '+8.2%', icon: Briefcase, color: 'from-purple-500 to-pink-500' },
//     { label: 'Resumes Analyzed', value: '5,392', change: '+23.1%', icon: FileText, color: 'from-orange-500 to-red-500' },
//     { label: 'Match Success Rate', value: '87.5%', change: '+3.4%', icon: TrendingUp, color: 'from-green-500 to-emerald-500' }
//   ];

//   const recentJobs = [
//     { id: 1, title: 'Senior Full Stack Developer', company: 'TechCorp Inc.', applicants: 45, status: 'active', posted: '2 days ago' },
//     { id: 2, title: 'Machine Learning Engineer', company: 'AI Solutions', applicants: 62, status: 'active', posted: '5 days ago' },
//     { id: 3, title: 'Backend Developer', company: 'StartupXYZ', applicants: 28, status: 'pending', posted: '1 week ago' },
//     { id: 4, title: 'DevOps Engineer', company: 'CloudTech', applicants: 33, status: 'active', posted: '3 days ago' },
//     { id: 5, title: 'Frontend Developer', company: 'WebCo', applicants: 19, status: 'closed', posted: '2 weeks ago' }
//   ];

//   const recentUsers = [
//     { id: 1, name: 'John Smith', email: 'john@example.com', resumes: 3, joined: '2024-01-15', status: 'active' },
//     { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', resumes: 5, joined: '2024-01-14', status: 'active' },
//     { id: 3, name: 'Mike Chen', email: 'mike@example.com', resumes: 2, joined: '2024-01-13', status: 'active' },
//     { id: 4, name: 'Emma Wilson', email: 'emma@example.com', resumes: 4, joined: '2024-01-12', status: 'inactive' }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
//       {/* Sidebar */}
//       <div className="fixed left-0 top-0 h-full w-64 bg-slate-950/50 backdrop-blur-xl border-r border-white/10 p-6">
//         <div className="flex items-center space-x-2 mb-8">
//           <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
//             <span className="text-white font-bold text-xl">✨</span>
//           </div>
//           <div>
//             <h2 className="text-white font-bold text-lg">JobMatch AI</h2>
//             <p className="text-gray-400 text-xs">Admin Panel</p>
//           </div>
//         </div>

//         <nav className="space-y-2">
//           {[
//             { id: 'overview', label: 'Overview', icon: TrendingUp },
//             { id: 'jobs', label: 'Manage Jobs', icon: Briefcase },
//             { id: 'users', label: 'Users', icon: Users },
//             { id: 'analytics', label: 'Analytics', icon: FileText },
//             { id: 'settings', label: 'Settings', icon: Settings }
//           ].map(item => (
//             <button
//               key={item.id}
//               onClick={() => setActiveTab(item.id)}
//               className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
//                 activeTab === item.id
//                   ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
//                   : 'text-gray-400 hover:bg-white/5 hover:text-white'
//               }`}
//             >
//               <item.icon className="w-5 h-5" />
//               <span>{item.label}</span>
//             </button>
//           ))}
//         </nav>

//         <button className="absolute bottom-6 left-6 right-6 flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition">
//           <LogOut className="w-5 h-5" />
//           <span>Logout</span>
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="ml-64 p-8">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
//             <p className="text-gray-400">Welcome back, Admin</p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
//               />
//             </div>
//             <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition flex items-center space-x-2">
//               <Plus className="w-5 h-5" />
//               <span>Add Job</span>
//             </button>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {stats.map((stat, idx) => (
//             <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition">
//               <div className="flex items-start justify-between mb-4">
//                 <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
//                   <stat.icon className="w-6 h-6 text-white" />
//                 </div>
//                 <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
//               </div>
//               <h3 className="text-gray-400 text-sm mb-1">{stat.label}</h3>
//               <p className="text-3xl font-bold text-white">{stat.value}</p>
//             </div>
//           ))}
//         </div>

//         {/* Recent Jobs Table */}
//         <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 mb-8">
//           <div className="p-6 border-b border-white/10">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-bold text-white">Recent Job Listings</h2>
//               <button className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold flex items-center space-x-1">
//                 <span>View All</span>
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-white/10">
//                   <th className="text-left text-gray-400 font-medium text-sm p-4">Job Title</th>
//                   <th className="text-left text-gray-400 font-medium text-sm p-4">Company</th>
//                   <th className="text-left text-gray-400 font-medium text-sm p-4">Applicants</th>
//                   <th className="text-left text-gray-400 font-medium text-sm p-4">Status</th>
//                   <th className="text-left text-gray-400 font-medium text-sm p-4">Posted</th>
//                   <th className="text-left text-gray-400 font-medium text-sm p-4">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {recentJobs.map(job => (
//                   <tr key={job.id} className="border-b border-white/5 hover:bg-white/5 transition">
//                     <td className="p-4">
//                       <div className="font-medium text-white">{job.title}</div>
//                     </td>
//                     <td className="p-4 text-gray-400">{job.company}</td>
//                     <td className="p-4 text-gray-400">{job.applicants}</td>
//                     <td className="p-4">
//                       <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${
//                         job.status === 'active' ? 'bg-green-500/20 text-green-400' :
//                         job.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
//                         'bg-gray-500/20 text-gray-400'
//                       }`}>
//                         {job.status === 'active' && <CheckCircle className="w-3 h-3" />}
//                         {job.status === 'pending' && <Clock className="w-3 h-3" />}
//                         {job.status === 'closed' && <XCircle className="w-3 h-3" />}
//                         <span className="capitalize">{job.status}</span>
//                       </span>
//                     </td>
//                     <td className="p-4 text-gray-400">{job.posted}</td>
//                     <td className="p-4">
//                       <div className="flex items-center space-x-2">
//                         <button className="p-2 hover:bg-white/10 rounded-lg transition">
//                           <Eye className="w-4 h-4 text-gray-400" />
//                         </button>
//                         <button className="p-2 hover:bg-white/10 rounded-lg transition">
//                           <Edit className="w-4 h-4 text-gray-400" />
//                         </button>
//                         <button className="p-2 hover:bg-white/10 rounded-lg transition">
//                           <Trash2 className="w-4 h-4 text-red-400" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Recent Users */}
//         <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
//           <div className="p-6 border-b border-white/10">
//             <h2 className="text-xl font-bold text-white">Recent Users</h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-white/10">
//                   <th className="text-left text-gray-400 font-medium text-sm p-4">Name</th>
//                   <th className="text-left text-gray-400 font-medium text-sm p-4">Email</th>
//                   <th className="text-left text-gray-400 font-medium text-sm p-4">Resumes</th>
//                   <th className="text-left text-gray-400 font-medium text-sm p-4">Joined</th>
//                   <th className="text-left text-gray-400 font-medium text-sm p-4">Status</th>
//                   <th className="text-left text-gray-400 font-medium text-sm p-4">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {recentUsers.map(user => (
//                   <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition">
//                     <td className="p-4">
//                       <div className="flex items-center space-x-3">
//                         <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
//                           {user.name.split(' ').map(n => n[0]).join('')}
//                         </div>
//                         <span className="text-white font-medium">{user.name}</span>
//                       </div>
//                     </td>
//                     <td className="p-4 text-gray-400">{user.email}</td>
//                     <td className="p-4 text-gray-400">{user.resumes}</td>
//                     <td className="p-4 text-gray-400">{user.joined}</td>
//                     <td className="p-4">
//                       <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
//                         user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
//                       }`}>
//                         {user.status}
//                       </span>
//                     </td>
//                     <td className="p-4">
//                       <button className="p-2 hover:bg-white/10 rounded-lg transition">
//                         <MoreVertical className="w-4 h-4 text-gray-400" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }