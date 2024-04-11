const { UserList, MovieList } = require("../FakeDate");
const _ = require("lodash");

const resolvers = {
  Query: {
    users() {
      return UserList;
    },
    user: (parent, args) => {
      return _.find(UserList, { id: Number(args.id) });
    },
    movies: (parent, args) => {
      return MovieList;
    },
    movie: (parent, args) => {
      return _.find(MovieList, { name: args.name });
    },
  },
  User: {
    favoriteMovies: () => {
      return _.filter(
        MovieList,
        (movie) =>
          movie.yearOfPublication >= 2000 && movie.yearOfPublication <= 2010
      );
    },
  },
  Mutation: {
    createUser: (parent, args) => {
      let lastId = UserList[UserList.length - 1].id;
      let newUser = { ...args.user, id: lastId + 1 };
      UserList.push(newUser);

      return newUser;
    },
    updateUser(parent, args) {
      const { name, username, age, nationality } = args.edits;
      
      UserList.forEach((user) => {
        if (user.id === Number(args.id)) {
          user.name = name;
          user.username = username;
          user.age = age;
          user.nationality = nationality;
        }
      });

      return _.find(UserList, { id: Number(args.id) });
    },
    updateUsername: (parent, args) => {
      const { id, newUsername } = args.input;
      let userUpdated;

      UserList.forEach((user) => {
        if (user.id === Number(id)) {
          user.username = newUsername;
          userUpdated = user;
        }
      });

      return userUpdated;
    },
    deleteUsers: (parent, args) => {
      const deletedUsers = [];

      args.ids.forEach((id) => {
        const userIndex = _.findIndex(UserList, { id: Number(id) });

        if (userIndex !== -1) {
          const userDeleted = UserList.splice(userIndex, 1)[0];
          deletedUsers.push(userDeleted);
        }
      });

      return deletedUsers;
    },
  },
};

module.exports = { resolvers };
