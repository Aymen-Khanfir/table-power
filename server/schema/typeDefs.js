const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    username: String!
    age: Int!
    nationality: Nationality!
    friends: [User]
    favoriteMovies: [Movie!]
  }

  type Movie {
    id: ID!
    name: String!
    yearOfPublication: Int!
    isInTheaters: Boolean!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User!
    movies: [Movie!]!
    movie(name: String!): Movie!
  }

  type Mutation {
    createUser(user: CreateUserInput!): User!
    updateUser(id: ID!, edits: EditUserInput!): User!
    updateUsername(input: UpdateUsernameInput!): User
    deleteUsers(ids: [ID!]!): [User]
  }

  input CreateUserInput {
    name: String!
    username: String!
    age: Int!
    nationality: Nationality = TUNISIA
  }

  input EditUserInput {
    name: String
    username: String
    age: Int
    nationality: String
  }

  input UpdateUsernameInput {
    id: ID!
    newUsername: String!
  }

  enum Nationality {
    CANADA
    BRAZIL
    INDIA
    GERMANY
    CHILE
    UKRAINE
    TUNISIA
  }
`;

module.exports = { typeDefs };
