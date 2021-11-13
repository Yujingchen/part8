import { gql  } from '@apollo/client'

export const ALL_BOOKS = gql`
query {
    allBooks {
        title,
        author,
        genres,
        published
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
    author
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

export const EDIT_AUTHOR = gql`
mutation editAuthorBorn($name: String!, $setBornTo: Int!) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    name
    born
  }
}
`