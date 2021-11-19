import React,{ useEffect, useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../query'


const Books = (props) => {
  const { data } = useQuery(ALL_BOOKS)
  const [booksByGenre, setBooks] = useState(data)
  const [genre, setGenre] = useState('')
  const [getBooks, result] = useLazyQuery(ALL_BOOKS)

  // const findBookByGenre = (genre) => {
  //   console.log("called")
  //   setGenre(genre)
  //   getBooks()
  // }

  useEffect(()=>{
    getBooks()
    if(result.data){
      setBooks(result.data.allBooks)
    }
  },[result.data])
  if(!props.show || !booksByGenre) {
    return <p> loading </p>
  }
  return (
    <div>
      <h2>books</h2>
      {genre ? <p>in genre {genre}</p>:null}
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
          {booksByGenre.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        <button onClick={() => getBooks({fetchPolicy: 'network-only', variables: { genre: 'refactoring' }})}>refactoring</button>
        {/* <button onClick={() => findBookByGenre('agile')}>agile</button>
        <button onClick={() => findBookByGenre('patterns')}>patterns</button>
        <button onClick={() => findBookByGenre('design')}>design</button>
        <button onClick={() => findBookByGenre('crime')}>crime</button>
        <button onClick={() => findBookByGenre('classic')}>classic</button>
        <button onClick={() => findBookByGenre('')}>all genres</button> */}
      </div>
    </div>
  )
}

export default Books