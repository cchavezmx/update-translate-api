import { useMachine } from '@xstate/react'
import { useEffect, useState } from 'react'
import gitMachine from './gitMachine'

const Login = () => {
  const [ email, setEmail ] = useState(undefined)
  const [ password, setPassword ] = useState(undefined)
  const [  isLogin, setIsLogin ] = useState(false)

  const [ state, send ] = useMachine(gitMachine)

  const handleLogin = () => {
    send("LOGIN", { data: { email, password }})
  }

  useEffect(() => {
    
    if(state.matches("success")){
      setIsLogin(true)
    }
  })

  return(
    <form className="mb-3">
      {
        !isLogin 

          ? <div className="login">
              <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Email"></input>
              <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Password"></input>    
              <button onClick={handleLogin}>Enviar</button>
            </div>

          : <span>Bievenido, la sesion solo dura 1 hora</span>
      }      
    </form>
  )
}


export default Login