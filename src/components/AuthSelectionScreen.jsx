import rruLogo from '../assets/rru-logo.png';

export default function AuthSelectionScreen({ setCurrentScreen }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full mix-blend-multiply filter blur-xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full mix-blend-multiply filter blur-xl" />
      </div>

      <div className="relative z-10 max-w-md w-full mx-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg mb-4">
              <img
                src={rruLogo}
                alt="RRU Logo"
                className="h-12 w-12 object-contain select-none drop-shadow-lg"
                draggable={false}
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-2">
              Welcome to RRU Cricket
            </h1>
            <p className="text-slate-300 text-sm">
              Choose how you'd like to access the system
            </p>
          </div>

          <div className="space-y-4">
            <button onClick={() => setCurrentScreen("register")} className="btn-primary">Register New Account</button>
            <button onClick={() => setCurrentScreen("login")} className="btn-secondary">User Login</button>
            <button onClick={() => setCurrentScreen("adminLogin")} className="btn-danger">Admin Access</button>
          </div>
        </div>
      </div>
    </div>
  );
}
