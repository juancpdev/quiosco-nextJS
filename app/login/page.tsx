"use client";

import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));

    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    setIsLoading(false);

    if (res.ok) {
      window.location.href = "/admin/orders";
    } else {
      setError("Credenciales incorrectas");
    }
  };
  
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #ffa726 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite'
    }}>
      
      {/* Partículas decorativas */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full opacity-10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full opacity-10 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      

      {/* Contenedor del formulario */}
      <div className="relative z-10 w-full max-w-md ">
        {/* Card con efecto glassmorphism */}
        <div className="rounded-3xl shadow-2xl p-8 md:p-10" style={{
          background: 'rgba(100, 100, 100, 0.5)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
        }}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 rounded-2xl mb-4" style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Bienvenido</h2>
            <p className="text-white opacity-80">Ingresa a tu cuenta</p>
          </div>

          {/* Formulario */}
          <div className="space-y-6">
            {/* Campo Email */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-white opacity-60 group-focus-within:opacity-100 transition-all duration-300" />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl py-3 pl-12 pr-4 text-white placeholder-white focus:outline-none transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(255, 255, 255, 0.5)'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              />
            </div>

            {/* Campo Contraseña */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-white opacity-60 group-focus-within:opacity-100 transition-all duration-300" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl py-3 pl-12 pr-12 text-white placeholder-white focus:outline-none transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(255, 255, 255, 0.5)'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-white opacity-60 hover:opacity-100 transition-all duration-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5 cursor-pointer" /> : <Eye className="w-5 h-5 cursor-pointer" />}
              </button>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="rounded-xl p-3 text-white bg-red-500 text-sm text-center" style={{
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                animation: 'shake 0.5s ease-in-out'
              }}>
                {error}
              </div>
            )}

            {/* Botón de Login */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="cursor-pointer w-full bg-white text-purple-600 font-semibold py-3 rounded-xl hover:opacity-90 focus:outline-none transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                boxShadow: '0 4px 15px 0 rgba(255, 255, 255, 0.3)'
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Ingresando...
                </div>
              ) : (
                "Ingresar"
              )}
            </button>
          </div>

          
        </div>

        
      </div>

      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        input::placeholder {
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}