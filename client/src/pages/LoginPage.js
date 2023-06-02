import { useState } from "react"
import { useLogin } from "../hooks/useLogin"
import { Link } from "react-router-dom";

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
      <form className="login" onSubmit={handleSubmit}>
        <h3>Log In</h3>
      
        <label>Email address:</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <label>Password:</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button disabled={isLoading}>Log in</button>
        {error && <div className="error">{error}</div>}
      </form>
      <h3>New to Membox? <Link to="/signup">Join now</Link></h3>
    </div>
  )
}

export default LoginPage;