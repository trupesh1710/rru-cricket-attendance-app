import { useEffect, useState } from "react";
import SplashScreen from "./components/SplashScreen.jsx";
import AuthSelectionScreen from "./components/AuthSelectionScreen.jsx";
import RegisterScreen from "./components/RegisterScreen.jsx";
import LoginScreen from "./components/LoginScreen.jsx";
import AdminLoginScreen from "./components/AdminLoginScreen.jsx";
import Dashboard from "./components/Dashboard.jsx";
import AdminSuccessScreen from "./components/AdminSuccessScreen.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import UserManagementScreen from "./components/UserManagementScreen.jsx";
import AttendanceManagementScreen from "./components/AttendanceManagementScreen.jsx";
import AdminReportsScreen from "./components/AdminReportsScreen.jsx";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("auth");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showAdminSuccessScreen, setShowAdminSuccessScreen] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showAttendanceManagement, setShowAttendanceManagement] = useState(false);
  const [showAdminReports, setShowAdminReports] = useState(false);
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
    if (showSuccessPopup || showAdminSuccessScreen || showAdminDashboard) {
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
  }, [user, currentScreen, showSuccessPopup, showAdminSuccessScreen, showAdminDashboard]);

  const handleAuth = (userData, userType) => {
    // Auth is now handled by the useAuth hook, this is just for navigation
    if (userType === "register") {
      setShowSuccessPopup(true);
    } else if (userType === "admin") {
      // For admin user, show enhanced admin success screen
      setShowAdminSuccessScreen(true);
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

  const handleAdminSuccessContinue = () => {
    setShowAdminSuccessScreen(false);
    setShowAdminDashboard(true);
  };

  const handleAdminSuccessLogout = async () => {
    setShowAdminSuccessScreen(false);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    setCurrentScreen("auth");
  };

  const handleAdminDashboardLogout = async () => {
    setShowAdminDashboard(false);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    setCurrentScreen("auth");
  };

  const handleBackToMainDashboard = () => {
    setShowAdminDashboard(false);
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

  // Show Admin Success Screen
  if (showAdminSuccessScreen) {
    return (
      <AdminSuccessScreen
        user={user}
        onContinue={handleAdminSuccessContinue}
        onLogout={handleAdminSuccessLogout}
      />
    );
  }

  // Show Admin Dashboard
  if (showAdminDashboard) {
    return (
      <AdminDashboard
        user={user}
        onLogout={handleAdminDashboardLogout}
        onBackToMain={handleBackToMainDashboard}
      />
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
    </>
  );
}
