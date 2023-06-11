import { useState } from "react"
import { useSignup } from "../hooks/useSignup"
import { Link } from "react-router-dom";

const SignupPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {signup, error, isLoading} = useSignup()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await signup(email, password)
  }

  return (
    <div>
      <Link to="/" className="flex gap-2 items-center px-16 py-6 z-50 relative">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
        </svg>
        <h1 className="font-semibold text-2xl relative bottom-0.5">Membox</h1>
      </Link>
      <div className="flex">
        <div className="flex flex-col items-center left-0 top-1/4 w-1/2 h-screen fixed z-40">
          <form className="flex flex-col gap-5 w-1/2" onSubmit={handleSubmit}>
            <h3 className="font-bold text-3xl">Create a New Account</h3>
            <div className="flex flex-col gap-2">
              <label className="text-xs">Email</label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border border-gray-300 rounded-sm p-1"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs">Password</label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border border-gray-300 rounded-sm p-1"
              />
            </div>
            {error && <div className="error">{error}</div>}
            <button className="bg-purple-600 text-white text-sm px-3 py-2 rounded-sm" disabled={isLoading}>Sign up</button>
          </form>
        </div>
        <div className="bg-gray-200 fixed right-0 top-0 w-1/2 h-screen"></div>
      </div>
    </div>
  )
}

export default SignupPage;