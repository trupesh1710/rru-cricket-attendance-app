// import { useEffect, useState } from "react";

// export default function App() {
//   const [showSplash, setShowSplash] = useState(true);
//   const [fadeOut, setFadeOut] = useState(false);
  
//   useEffect(() => {
//     const t1 = setTimeout(() => setFadeOut(true), 2000); // start fade
//     const t2 = setTimeout(() => setShowSplash(false), 2500); // remove splash
//     return () => {
//       clearTimeout(t1);
//       clearTimeout(t2);
//     };
//   }, []);
  
//   return (
//     <div className="min-h-screen">
//       {showSplash ? <SplashScreen fadeOut={fadeOut} /> : <MainApp />}
//     </div>
//   );
// }

// // Removed TypeScript type annotation from props
// function SplashScreen({ fadeOut }) {
//   return (
//     <div
//       className={`fixed inset-0 flex flex-col justify-center items-center
//       min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white
//       transition-all duration-700 ease-out ${fadeOut ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
//     >
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
//         <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000" />
//       </div>
      
//       {/* Main content container */}
//       <div className="relative z-10 flex flex-col items-center justify-center space-y-8 px-6 text-center">
//         {/* Logo container with modern glass effect */}
//         <div className="relative group">
//           <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-full blur-2xl opacity-30 group-hover:opacity-40 animate-pulse" />
//           <div className="relative flex justify-center items-center h-32 w-32 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl ring-1 ring-inset ring-white/10">
//             <img
//               src="/rru-logo.png"
//               alt="RRU Logo"
//               className="h-20 w-20 object-contain select-none drop-shadow-lg"
//               draggable={false}
//             />
//           </div>
//         </div>
        
//         {/* Title with modern typography */}
//         <div className="space-y-3">
//           <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
//             RRU Cricket Attendance
//           </h1>
//           <p className="text-lg md:text-xl text-slate-300 font-medium">
//             Management System
//           </p>
//         </div>
        
//         {/* Modern loading indicator */}
//         <div className="flex flex-col items-center space-y-4 mt-8">
//           <div className="flex space-x-1">
//             <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
//             <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-200" />
//             <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-400" />
//           </div>
//           <p className="text-sm text-slate-400 font-medium tracking-wider">
//             INITIALIZING
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function MainApp() {
//   const [currentTime, setCurrentTime] = useState(new Date());
  
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);
  
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
//       {/* Background decoration */}
//       <div className="absolute inset-0">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full mix-blend-multiply filter blur-xl" />
//         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full mix-blend-multiply filter blur-xl" />
//       </div>
      
//       {/* Main content card */}
//       <div className="relative z-10 max-w-2xl w-full mx-6">
//         <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 md:p-12 text-center">
//           {/* Welcome section */}
//           <div className="space-y-6">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg mb-4">
//               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//               </svg>
//             </div>
            
//             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
//               Welcome to RRU Cricket
//             </h1>
            
//             <p className="text-slate-300 text-lg leading-relaxed max-w-md mx-auto">
//               Advanced attendance management system for cricket activities and events
//             </p>
//           </div>
          
//           {/* Quick stats or info cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
//             <div className="bg-white/5 rounded-xl p-4 border border-white/10">
//               <div className="text-2xl font-bold text-blue-400">{currentTime.toLocaleTimeString()}</div>
//               <div className="text-sm text-slate-400">Current Time</div>
//             </div>
//             <div className="bg-white/5 rounded-xl p-4 border border-white/10">
//               <div className="text-2xl font-bold text-green-400">Online</div>
//               <div className="text-sm text-slate-400">System Status</div>
//             </div>
//             <div className="bg-white/5 rounded-xl p-4 border border-white/10">
//               <div className="text-2xl font-bold text-purple-400">v2.0</div>
//               <div className="text-sm text-slate-400">Version</div>
//             </div>
//           </div>
          
//           {/* Action buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
//             <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
//               Start Attendance
//             </button>
//             <button className="px-8 py-3 bg-white/10 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/20 transition-all duration-300">
//               View Reports
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import SplashScreen from "./components/SplashScreen.jsx";
import AuthSelectionScreen from "./components/AuthSelectionScreen.jsx";
import RegisterScreen from "./components/RegisterScreen.jsx";
import LoginScreen from "./components/LoginScreen.jsx";
import AdminLoginScreen from "./components/AdminLoginScreen.jsx";
import Dashboard from "./components/Dashboard.jsx";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("auth");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showAdminSuccessPopup, setShowAdminSuccessPopup] = useState(false);
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 2000);
    const t2 = setTimeout(() => setShowSplash(false), 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    // If registration success popup is showing, do not redirect to dashboard
    if (showSuccessPopup || showAdminSuccessPopup) {
      return;
    }
    // If user is authenticated and we're not on dashboard, redirect to dashboard
    if (user && currentScreen !== "dashboard") {
      setCurrentScreen("dashboard");
    }
    // If user is not authenticated and we're on dashboard, redirect to auth
    else if (!user && currentScreen === "dashboard") {
      setCurrentScreen("auth");
    }
  }, [user, currentScreen, showSuccessPopup, showAdminSuccessPopup]);

  const handleAuth = (userData, userType) => {
    // Auth is now handled by the useAuth hook, this is just for navigation
    if (userType === "register") {
      setShowSuccessPopup(true);
    } else if (userType === "admin") {
      // For admin user, show admin login success popup
      setShowAdminSuccessPopup(true);
    } else {
      setCurrentScreen("dashboard");
    }
  };

  const handlePopupClose = async () => {
    setShowSuccessPopup(false);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    setCurrentScreen("auth");
  };

  const handleAdminPopupClose = () => {
    setShowAdminSuccessPopup(false);
    setCurrentScreen("dashboard");
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentScreen("auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (showSplash) {
    return <SplashScreen fadeOut={fadeOut} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  let screenComponent;
  switch (currentScreen) {
    case "register":
      screenComponent = <RegisterScreen onBack={() => setCurrentScreen("auth")} onRegister={handleAuth} />;
      break;
    case "login":
      screenComponent = <LoginScreen onBack={() => setCurrentScreen("auth")} onLogin={handleAuth} />;
      break;
    case "adminLogin":
      screenComponent = <AdminLoginScreen onBack={() => setCurrentScreen("auth")} onLogin={handleAuth} />;
      break;
    case "dashboard":
      screenComponent = <Dashboard user={user} onLogout={handleLogout} />;
      break;
    default:
      screenComponent = <AuthSelectionScreen setCurrentScreen={setCurrentScreen} />;
  }

  return (
    <>
      {screenComponent}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 max-w-md w-full mx-6">
            <h2 className="text-xl font-bold text-white mb-4 text-center">Registration Successful</h2>
            <p className="text-slate-300 mb-6 text-center">Your account has been created successfully!</p>
            <button
              onClick={handlePopupClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {showAdminSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 max-w-md w-full mx-6">
            <h2 className="text-xl font-bold text-white mb-4 text-center">Admin Login Successful</h2>
            <p className="text-slate-300 mb-6 text-center">You have been logged in as an administrator!</p>
            <button
              onClick={handleAdminPopupClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}