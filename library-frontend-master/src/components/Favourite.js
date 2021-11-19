import React,{ useState } from 'react'

const Favourite = (props) => {
  const { books, genre } = props
  const [book, setBook] = useState(null)

  // call the query using lazyQuery
  // rerender the compinent when receive a result from lazyQuery

  if(!props.show || !books) {
    return null
  }
  if(book) {
    return (
      <div>
        <h5>{book.title}</h5>
        <h5>{book.published}</h5>
        <h5>{book.genres.map(g=><span>{g} </span>)}</h5>
        <h5>{book.author.name}</h5>
        <button onClick={() => setBook(null)}>close</button>
      </div>
    )
  }
  const booksByGenre = genre ? books.filter(book=>book.genres.includes(genre)): books
  return (
    <div>
      <h2>recommendations</h2>
      {genre ? <p>books in your faviourite genre <b>{genre}</b></p>:null}
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
    </div>
  )
}

export default Favourite