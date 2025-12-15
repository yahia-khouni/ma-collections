import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="w-full flex flex-col items-center"
      data-testid="login-page"
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
        className="text-2xl font-light text-grey-90 mb-2"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        Welcome Back
      </h1>
      <p className="text-center text-sm text-grey-50 mb-8">
        Sign in to access your account and continue shopping.
      </p>
      
      <form className="w-full space-y-4" action={formAction}>
        <div className="space-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton 
          data-testid="sign-in-button" 
          className="w-full mt-6 h-12 bg-brand-gold hover:bg-brand-gold-light text-grey-90 font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-brand-gold/20"
        >
          Sign In
        </SubmitButton>
      </form>
      
      <div className="flex items-center gap-4 my-6 w-full">
        <div className="flex-1 h-px bg-grey-10" />
        <span className="text-xs text-grey-40 uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-grey-10" />
      </div>
      
      <p className="text-center text-sm text-grey-50">
        New to M&A Collections?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="text-brand-gold hover:text-brand-gold-light transition-colors font-medium"
          data-testid="register-button"
        >
          Create an account
        </button>
      </p>
    </div>
  )
}

export default Login
