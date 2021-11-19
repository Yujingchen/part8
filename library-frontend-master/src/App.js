
import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import Favourite from './components/Favourite'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { useQuery, useApolloClient } from '@apollo/client'
import { ALL_BOOKS } from './query'

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState([])
  const [token, setToken] = useState(null)
  const sqlResult = useQuery(ALL_BOOKS)
  const client = useApolloClient()

  useEffect(()=>{
    const existToken = localStorage.getItem('bookapp-user-token') || null
    setToken(existToken)
  },[])

  if(!sqlResult.data) {
    return <div>loading..</div>
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const showNotification = (message)=>{
    setErrorMessage(message)
    setTimeout(()=>{
      setErrorMessage(null)
    }, 5000)
  }

  const Notification = ({errorMessage}) => {
    if ( !errorMessage ) {
      return null
    }
    return (
      <div style={{color: 'red'}}>
      {errorMessage}
      </div>
    )
  }

  if(!token) {
    return (
      <div> 
        <Notification errorMessage={errorMessage}/>
        <h2>Login</h2>
        <LoginForm setToken={setToken} setError={showNotification}/>
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token? (<button onClick={() => setPage('add')}>add book</button>): null}
        {token? (<button onClick={() => setPage('favourite')}>favourite</button>): null}
        {token? (<button onClick={() => logout()}>log out</button>): null}
        {token? null:<button onClick={() => setPage('login')}>login</button>}
      </div>
      <Notification errorMessage={errorMessage}></Notification>
      <Authors
        show={page === 'authors'}
        setError={showNotification}
      />

      <Books
        show={page === 'books'}
      />

      <Favourite
        show={page === 'favourite'}
        books={sqlResult.data?.allBooks}
        genre={"refactoring"}
      />

      <NewBook
        show={page === 'add'}
        setError={showNotification}
      />

    </div>
  )
}

export default App