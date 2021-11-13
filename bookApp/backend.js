const { ApolloServer, gql } = require('apollo-server')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const Book = require('./models/books')
const Author = require('./models/author')
const config = require('./utils/config')

const url = config.MONGODB_URI
console.log('connected to mongodb')
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
    .catch(error => console.log('error connecting to MongoDb:', error.message))

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]


const typeDefs = gql`
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }
  type Info {
    published: Int!
    genres: [String!]
  }
  type Book {
    title: String!
    published: Int
    author: String!
    id: ID!
    genres: [String!]
    info: Info!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genres: String): [Book!]!
    allAuthor(born: Boolean): [Author!]!
    findBook(title: String): Book
    findAuthor(name: String!): Author
  }
type Mutation {
  addBook(
    title: String!
    published: Int!
    author: String!
    genres:[String!]
  ): Book
  editBook(
    title: String!
    published: Int!
    author: String!
    genres:[String!]
  ): Book
  editAuthor(
    name: String!
    setBornTo: Int!
  ): Author
}
`

const resolvers = {
  Query: {
    allBooks: (root, args) => {
      const book = Book.find({})
      if(! (args.name||args.genres)) {
        console.log('called', book)
        return book
      }
      else {
        let filteredBooks = book
        if(args.author) {w
           filteredBooks = filteredBooks.filter((book) => book.author === args.author)
        }
        if(args.genres) {
         filteredBooks = filteredBooks.filter((book) => book.genres.includes(args.genres))
        console.log(filteredBooks)
        }
        console.log('called2')
        return filteredBooks
      }
    },
    authorCount: () => authors.length,
    bookCount: () => books.length,
    allAuthor: (root, args) => {
      if(!args.born) {
        return authors
      }
      const byBorn = (author) => args.born === true ? author.born : !author.born
      return authors.filter(byBorn)
    },
    findBook: (root, args) => books.find(b => b.title === args.title),
    findAuthor: (root, args) => books.find(a => a.name.contains(args)),
  },
  Mutation: {
    addBook: (root, args) => {
      const book = { ...args, id: uuid() }
      books = books.concat(book)
      const authorsName = authors.map(author=>author.name)
      if(!authorsName.includes(args.author)){
        authors = authors.concat({name: args.author})
      }
      return book
    },
    editBook: (root,args) => {
      const book = books.find(book => book.title === args.title)
      if (!book) {
        return null
      }
      const updatedBook = { ...book, author: args.author, published: args.published, genres: args.genres}
      books.map((book)=> book.title === args.title ? updatedBook : book)
      return updatedBook
    },
    editAuthor: (root, args) => {
      const author = authors.find(author => author.name === args.name)
      if(!author) {
        return null
      }
      const updatedAuthor = { ...author, born: args.setBornTo }
      authors = authors.map((author) => author.name === args.name ? updatedAuthor : author)
      console.log(authors)
      console.log(updatedAuthor)
      return updatedAuthor
    }
  },
  Book: {
    title: (root) => root.title,
    published: (root) => root.published,
    author: (root)=> root.author,
    id: (root) => root.id,
    genres: (root) => root.genres,
    info: (root) => { return {published: root.published, genres: root.genres} }
  },
  Author: {
    name: (root) => root.name,
    id: (root) => root.id,
    born: (root)=> root.born,
    bookCount: (root) => {
      const bookCount = books.filter((book)=>book.author === root.name).length
      return bookCount
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})