const { ApolloServer, gql, UserInputError } = require('apollo-server')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const Book = require('./models/books')
const Author = require('./models/author')
const config = require('./utils/config')
const jwt = require('jsonwebtoken')
const JWT_SECRET = config.JWT_SECRET || "secretpassw"

const url = config.MONGODB_URI
console.log('connected to mongodb')
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
    .catch(error => console.log('error connecting to MongoDb:', error.message))



// let authors = [
//   {
//     name: 'Robert Martin',
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: 'Martin Fowler',
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963
//   },
//   {
//     name: 'Fyodor Dostoevsky',
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821
//   },
//   { 
//     name: 'Joshua Kerievsky', // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   { 
//     name: 'Sandi Metz', // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ]

// let books = [
//   {
//     title: 'Clean Code',
//     published: 2008,
//     author: 'Robert Martin',
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Agile software development',
//     published: 2002,
//     author: 'Robert Martin',
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ['agile', 'patterns', 'design']
//   },
//   {
//     title: 'Refactoring, edition 2',
//     published: 2018,
//     author: 'Martin Fowler',
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Refactoring to patterns',
//     published: 2008,
//     author: 'Joshua Kerievsky',
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'patterns']
//   },  
//   {
//     title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//     published: 2012,
//     author: 'Sandi Metz',
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'design']
//   },
//   {
//     title: 'Crime and punishment',
//     published: 1866,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'crime']
//   },
//   {
//     title: 'The Demon ',
//     published: 1872,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'revolution']
//   },
// ]

// const fn = async ()=> {
//   books.forEach(async(book)=> {
//   let book1 = new Book(book)
//   await book1.save();
//   })

//   authors.forEach(async(author) => {
//     let author1 = new Author(author)
//   await author1.save();
//   })
// }
// fn()
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
  type User {
    username: String!
    friends: [Author!,Book!]
    id: ID!
  }
  type Token {
    value: String!
  }
  type Query {
    me: User
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genres: String): [Book!]!
    allAuthor(born: Boolean): [Author!]!
    findBook(title: String): Book
    findAuthor(name: String!): Author
  }
type Mutation {
  createUser(
    username:String!
  ):User
  login(
    username: String!
    password: String!
  ):Token
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
    allBooks: async (root, args) => {
      const book = await Book.find()
      if(! (args.name||args.genres)) {
        return book
      }
      else {
        let filteredBooks = book
        if(args.author) {
           filteredBooks = filteredBooks.filter((book) => book.author === args.author)
        }
        if(args.genres) {
         filteredBooks = filteredBooks.filter((book) => book.genres.includes(args.genres))
        }
        return filteredBooks
      }
    },
    authorCount: async () => await Author.collection.countDocuments(),
    bookCount: async () => await Book.collection.countDocuments(),
    allAuthor: async (root, args) => {
      const authors = await Author.find()
      if(!args.born) {
        return authors
      }
      const byBorn = (author) => args.born === true ? author.born : !author.born
      return authors.filter(byBorn)
    },
    findBook: async (root, args) => await Book.find({ title: args.title}),
    findAuthor: async (root, args) => await Book.find({author: args.name}),
  },
  Mutation: {
    createUser: async (root, args) => {
      const user = new User({username: args.username})
      return await user.save().catch(error=>{
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({username: args.username})
      if(!user || args.password !== 'secretpassw') {
        throw new UserInputError('wrong credientials')
      }
      const userForToken = {
        username: user.username,
        id: user._id
      }
      return { value: jwt.sign(userForToken, JWT_SECRET)}
    },
    addBook: async (root, args) => {
      const book = new Book({ ...args })
      try {
        await book.save()
      }
      catch(error) {
        throw new UserInputError(error.message, {invalidArgs: args})
      }
      if(!Author.find(args.author)) {
        const author = new Author({name: args.author})
        try {
          await book.save()
        }
        catch(error) {
          throw new UserInputError(error.message, {invalidArgs: args})
        }
      }
      return book
    },
    editBook: async (root,args) => {
      const book = await Book.find({ title: args.title})
      if (!book) {
        return null
      }
      const updatedBook = { ...book, author: args.author, published: args.published, genres: args.genres}
      try {
        return await Book.findOneAndUpdate({title: args.title}, updatedBook)
      }
      catch(error) {
        throw new UserInputError(error.message, {invalidArgs: args})
      }
    },
    editAuthor: async (root, args) => {
      const author = await Author.find({ name: args.name})
      if(!author) {
        return null
      }
      const updatedAuthor = { ...author, born: args.setBornTo }
      console.log(updatedAuthor)
      try {
        return await Author.findOneAndUpdate({name: args.name}, updatedAuthor)
      }
      catch(error) {
        throw new UserInputError(error.message, {invalidArgs: args})
      }
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
    bookCount: async (root) => {
      const books = await Book.find()
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