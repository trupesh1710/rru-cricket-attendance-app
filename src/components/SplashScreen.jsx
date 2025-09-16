import rruLogo from '../assets/rru-logo.png';

export default function SplashScreen({ fadeOut }) {
  return (
    <div
      className={`fixed inset-0 flex flex-col justify-center items-center
      min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white
      transition-all duration-700 ease-out ${fadeOut ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 px-6 text-center">
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-full blur-2xl opacity-30 group-hover:opacity-40 animate-pulse" />
          <div className="relative flex justify-center items-center h-32 w-32 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl ring-1 ring-inset ring-white/10">
            <img
              src={rruLogo}
              alt="RRU Logo"
              className="h-20 w-20 object-contain select-none drop-shadow-lg"
              draggable={false}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            RRU Cricket Attendance
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-medium">
            Management System
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4 mt-8">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-200" />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-400" />
          </div>
          <p className="text-sm text-slate-400 font-medium tracking-wider">
            INITIALIZING
          </p>
        </div>
      </div>
    </div>
  );
}
