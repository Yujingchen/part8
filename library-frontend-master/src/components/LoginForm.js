import React,{ useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../query'

const LoginForm = ({setToken, setError}) => {
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)
  const [login, loginToken] = useMutation(LOGIN)

  useEffect(() => {
    if ( loginToken.data ) {
      const token = loginToken.data.login.value
      setToken(token)
      localStorage.setItem('bookapp-user-token', token)
    }
  }, [loginToken.data]) // eslint-disable-line

  const submit = async (event) => {
    event.preventDefault()
    try {
        const result = await login({variables:{username: username, password: password}})
        const token = result.data.login.value
        console.log(result.data.login.value)
        localStorage.setItem('phonenumbers-user-token', token)
        setToken(token)
    }
    catch (error){
        console.log(error)
        setError('username or password is wrong')
    }
 }

  return (
    <div>
      <form onSubmit={(event)=>submit(event)}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm