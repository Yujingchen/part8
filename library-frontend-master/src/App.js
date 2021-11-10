
import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { gql, useQuery } from '@apollo/client'

const ALL_BOOKS = gql`
query {
    allBooks {
        title,
        author,
        genres,
        published
    }
}
`



const App = () => {
  const [page, setPage] = useState('authors')
  const [books, setBooks] = useState([])
  const sqlResult = useQuery(ALL_BOOKS)
  if(!sqlResult.data) {
    return <div>loading..</div>
  }
  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
        books={sqlResult.data?.allBooks}
      />

      <NewBook
        show={page === 'add'}
      />

    </div>
  )
}

export default App