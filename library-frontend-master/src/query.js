import { gql  } from '@apollo/client'

export const ALL_BOOKS = gql`
query AllBooks {
  allBooks{
    title
    published
    genres
    author {
      name
      born
      bookCount
    }
  }
}
`

export const CREATE_BOOK = gql`
mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres,
) {
    title
    author {
      name
    }
    published
    genres
    info {
    published
    genres
    }
  }
}
`


export const FIND_BOOK = gql`
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


export const ALL_AUTHORS = gql`
query {
  allAuthor {
    name
    born
    bookCount
  }
}
`

export const LOGIN = gql`
mutation($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value
  }
}
`


export const EDIT_AUTHOR = gql`
mutation editAuthorBorn($name: String!, $setBornTo: Int!) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    name
    born
  }
}
`