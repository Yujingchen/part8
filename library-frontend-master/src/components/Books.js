import React,{ useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { FIND_BOOK } from '../query'


const Books = (props) => {
  const { books } = props
  const [book, setBook] = useState(null)
  // call the query using lazyQuery
  const [getBook, result] = useLazyQuery(FIND_BOOK)
  const showBook = (title)=>{
    getBook({variables:{titleToSearch: title}})
    console.log(book)
  }
  // rerender the compinent when receive a result from lazyQuery
  useEffect(()=>{
    if(result.data){
      setBook(result.data.findBook)
    }
  },[result.data])
  if(!props.show || !books) {
    return null
  }
  if(book) {
    return (
      <div>
        <h5>{book.title}</h5>
        <h5>{book.info?.published}</h5>
        <h5>{book.info?.genres.map(g=><span>{g} </span>)}</h5>
        <h5>{book.author}</h5>
        <button onClick={() => setBook(null)}>close</button>
      </div>
    )
  }

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            <button onClick={() => showBook(a.title)} >
            show info
          </button> 
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books