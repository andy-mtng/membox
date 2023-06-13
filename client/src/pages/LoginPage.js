import { useState } from "react"
import { useLogin } from "../hooks/useLogin"
import { Link } from "react-router-dom";
import PurpleCloudsCover from "../assets/purple-clouds.jpg"

const LoginPage = () => {
  const [email, setEmail] = useState('bob@gmail.com')
  const [password, setPassword] = useState('Abc123456!')
  const {login, error, isLoading} = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await login(email, password)
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
        <div className="flex flex-col justify-center items-center left-0 top-0 w-1/2 h-screen fixed z-40">
          <form className="flex flex-col gap-5 w-1/2" onSubmit={handleSubmit}>
            <div>
              <h3 className="font-bold text-3xl">Welcome Back!</h3>
              <p className="text-gray-400 text-sm mt-2">Please enter your details.</p>
            </div>
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
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button className="bg-purple-600 text-white text-sm px-3 py-2 rounded-sm" disabled={isLoading}>Log in</button>
          </form>
          <h3 className="mt-4">New to Membox? <Link to="/signup" className="text-purple-600">Join now</Link></h3>
        </div>
        <img src={PurpleCloudsCover} className="object-cover fixed right-0 top-0 w-1/2 h-screen"></img>
      </div>
    </div>
  )
}

export default LoginPage;