
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from './query'




const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState([])
  const sqlResult = useQuery(ALL_BOOKS)
  if(!sqlResult.data) {
    return <div>loading..</div>
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

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>
      <Notification errorMessage={errorMessage}></Notification>
      <Authors
        show={page === 'authors'}
        setError={showNotification}
      />

      <Books
        show={page === 'books'}
        books={sqlResult.data?.allBooks}
      />

      <NewBook
        show={page === 'add'}
        setError={showNotification}
      />

    </div>
  )
}

export default App