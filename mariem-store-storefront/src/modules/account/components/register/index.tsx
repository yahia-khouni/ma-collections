"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div
      className="w-full flex flex-col items-center"
      data-testid="register-page"
    >
      {/* Logo/Brand */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <div className="w-10 h-10 bg-brand-gold rotate-45" />
          <span 
            className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            M
          </span>
        </div>
      </div>
      
      <h1 
        className="text-2xl font-light text-grey-90 mb-2 text-center"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        Join M&A Collections
      </h1>
      <p className="text-center text-sm text-grey-50 mb-6">
        Create your account for an exclusive shopping experience.
      </p>
      
      <form className="w-full space-y-4" action={formAction}>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First name"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label="Last name"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
        </div>
        <Input
          label="Email"
          name="email"
          required
          type="email"
          autoComplete="email"
          data-testid="email-input"
        />
        <Input
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          data-testid="phone-input"
        />
        <Input
          label="Password"
          name="password"
          required
          type="password"
          autoComplete="new-password"
          data-testid="password-input"
        />
        
        <ErrorMessage error={message} data-testid="register-error" />
        
        <p className="text-center text-xs text-grey-40 mt-4">
          By creating an account, you agree to our{" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="text-brand-gold hover:text-brand-gold-light transition-colors"
          >
            Privacy Policy
          </LocalizedClientLink>{" "}
          and{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="text-brand-gold hover:text-brand-gold-light transition-colors"
          >
            Terms of Use
          </LocalizedClientLink>
          .
        </p>
        
        <SubmitButton 
          className="w-full h-12 bg-brand-gold hover:bg-brand-gold-light text-grey-90 font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-brand-gold/20" 
          data-testid="register-button"
        >
          Create Account
        </SubmitButton>
      </form>
      
      <div className="flex items-center gap-4 my-6 w-full">
        <div className="flex-1 h-px bg-grey-10" />
        <span className="text-xs text-grey-40 uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-grey-10" />
      </div>
      
      <p className="text-center text-sm text-grey-50">
        Already have an account?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="text-brand-gold hover:text-brand-gold-light transition-colors font-medium"
        >
          Sign in
        </button>
      </p>
    </div>
  )
}

export default Register
