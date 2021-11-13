import React, { useEffect, useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../query'
import { useLazyQuery, useMutation } from '@apollo/client'
import Select from 'react-select'


const Authors = ({show, setError}) => {
  const [authors, setAuthors] = useState([])
  const [name, setName] = useState('')
  const [birthdate, setBirthdate] = useState()
  const [getAuthors, result]= useLazyQuery(ALL_AUTHORS)
  const [ changeBirthdate ] = useMutation(
    EDIT_AUTHOR,
    { refetchQueries: [{query: ALL_AUTHORS}],
    onError: (error) => {
      setError("not able to add a new book due to wrong input")
    }
  })

const options = authors.map(author => { return {value: author.name, label: author.name}})
console.log(options)
  const updateAuthorClick = (event) => {
    event.preventDefault()
    changeBirthdate({ variables: {name: name.value, setBornTo: Number(birthdate)} })
    setName('')
    setBirthdate('')
  }

  useEffect(()=>{
    getAuthors()
    if(result.data){
      setAuthors(result.data.allAuthor)
    }
  },[result.data])
  if (!show) {
    return null
  }
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
    <h2> change born date</h2>
    <div>
      name
      <Select defaultValue={name} onChange={setName} options={options}/>
    </div>
    <div>
      born
      <input type="number" value={birthdate || ""} onChange={({target})=> setBirthdate(target.value)}></input>
    </div>
    <button onClick={updateAuthorClick}>Update author</button>
    </div>
  )
}

export default Authors
