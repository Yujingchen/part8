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

export const EDIT_NUMBER = gql`
  mutation editNumber($title: String!, $author: String!, $published: Int!, $genres: [String!]) {
    editNumber(
        title: $title,
        author: $author,
        published: $published,
        genres: $genres)  {
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