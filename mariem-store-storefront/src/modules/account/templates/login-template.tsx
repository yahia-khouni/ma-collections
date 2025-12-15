"use client"

import { useState } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 py-12">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-gold/3 rounded-full blur-3xl" />
      </div>
      
      <div className="relative w-full max-w-md">
        {/* Decorative card wrapper */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-black/5 border border-grey-10 p-8 md:p-10">
          {currentView === "sign-in" ? (
            <Login setCurrentView={setCurrentView} />
          ) : (
            <Register setCurrentView={setCurrentView} />
          )}
        </div>
        
        {/* Decorative corners */}
        <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-brand-gold/30 rounded-tl-lg" />
        <div className="absolute -top-2 -right-2 w-8 h-8 border-r-2 border-t-2 border-brand-gold/30 rounded-tr-lg" />
        <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-2 border-b-2 border-brand-gold/30 rounded-bl-lg" />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-brand-gold/30 rounded-br-lg" />
      </div>
    </div>
  )
}

export default LoginTemplate
