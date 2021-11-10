import React,{ useEffect, useState } from 'react'
import { gql, useLazyQuery, useQuery } from '@apollo/client'


const FIND_BOOK = gql`
query findBookByTitle($titleToSearch: String!){
    findBook(title: $titleToSearch) {
        title,
        author,
        genres,
        published,
        info{
          published,
          genres
        }
    }
}
`

const Books = (props) => {
  const { books } = props
  const [book, setBook] = useState({})
  // call the query using lazyQuery
  const [getBook, result] = useLazyQuery(FIND_BOOK)
  const showBook = (title)=>{
    getBook({variables:{titleToSearch: title}})
  }
  // rerender the compinent when receive a result from lazyQuery
  useEffect(()=>{
    if(result.data){
      setBook(result.data.findBook)
    }
  },[result])

  if(!props.show || !books) {
    return null
  }
  console.log(!Object.keys(book).length === 0)
  if(!Object.keys(book).length === 0) {
    return (
      <div>
        <h2>{book.title}</h2>
        <h2>{book.info?.published}</h2>
        <h2>{book.info?.genres.map(g=><span>{g} </span>)}</h2>
        <h2>{book.author}</h2>
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