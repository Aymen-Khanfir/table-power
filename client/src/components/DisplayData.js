import React, { useState } from "react";
import { useQuery, useLazyQuery, gql, useMutation } from "@apollo/client";
import "./displayData.css";
import Modal from "./Modal";

const QUERY_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
      username
      age
      nationality
    }
  }
`;

const QUERY_ALL_MOVIES = gql`
  query GetAllMovies {
    movies {
      id
      name
      yearOfPublication
      isInTheaters
    }
  }
`;

const GET_MOVIE_BY_NAME = gql`
  query Movie($name: String!) {
    movie(name: $name) {
      id
      isInTheaters
      name
      yearOfPublication
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($user: CreateUserInput!) {
    createUser(user: $user) {
      id
      name
    }
  }
`;

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID!, $edits: EditUserInput!) {
    updateUser(id: $id, edits: $edits) {
      id
      name
    }
  }
`;

const DELETE_USER_MUTATION = gql`
  mutation DeleteUsers($ids: [ID!]!) {
    deleteUsers(ids: $ids) {
      id
      name
    }
  }
`;

function DisplayData() {
  const [movieSearched, setMovieSearched] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isChecked, setIsChecked] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState(null);

  const { data, loading } = useQuery(QUERY_ALL_USERS);
  const { data: movieData } = useQuery(QUERY_ALL_MOVIES);
  const [fetchMovie, { data: movieSearchedData, error: movieError }] =
    useLazyQuery(GET_MOVIE_BY_NAME);

  const openModal = (user) => {
    setIsModalOpen(true);
    setSelectedUser(user);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [createUser] = useMutation(CREATE_USER_MUTATION, {
    refetchQueries: [{ query: QUERY_ALL_USERS }],
  });

  const [updateUser] = useMutation(UPDATE_USER_MUTATION, {
    refetchQueries: [{ query: QUERY_ALL_USERS }],
  });

  const [deleteUsers] = useMutation(DELETE_USER_MUTATION, {
    refetchQueries: [{ query: QUERY_ALL_USERS }],
  });

  const handleDelete = async (userId) => {
    try {
      const idsToDelete = userId !== null ? [userId] : isChecked.slice();

      await deleteUsers({
        variables: {
          ids: idsToDelete,
        },
      });

      setIsChecked([]);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const checkedUserList = (id) => {
    setIsChecked((prev) => {
      const newChecked = prev.includes(id)
        ? prev.filter((checkedId) => checkedId !== id)
        : [...prev, id];

      return newChecked;
    });
  };

  const checkedAllUserList = () => {
    setIsChecked((prevChecked) => {
      const allSelected = !(prevChecked.length < data.users.length);

      return allSelected ? [] : data.users.map((user) => user.id);
    });
  };

  return (
    <div>
      {loading ? (
        <h1 className="loading">Data is loading...</h1>
      ) : (
        <>
          <div className="container">
            <div className="container-controller">
              <h1>Display All Users</h1>
              <div>
                <button
                  onClick={() => {
                    openModal(null);
                    setMode("create");
                  }}
                >
                  Add New User
                </button>
                <button
                  style={
                    isChecked.length > 0
                      ? { display: "inline" }
                      : { display: "none" }
                  }
                  onClick={() => handleDelete(null)}
                >
                  Delete all
                </button>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>
                    <input
                      type="checkbox"
                      onChange={checkedAllUserList}
                      checked={isChecked.length === data.users.length}
                    />
                  </th>

                  <th>Name</th>
                  <th>Username</th>
                  <th>Age</th>
                  <th>Nationality</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={isChecked.includes(user.id)}
                          onChange={() => checkedUserList(user.id)}
                        />
                      </td>

                      <td>{user.name}</td>
                      <td>{user.username}</td>
                      <td>{user.age}</td>
                      <td>{user.nationality}</td>
                      <td>
                        <div>
                          <div onClick={() => handleDelete(user.id)}>X</div>
                          <div
                            onClick={() => {
                              openModal(user);
                              setMode("update");
                            }}
                          >
                            []
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="container">
            <div className="container-controller">
              <h1>Display All Movies</h1>
              <div>
                <input
                  type="text"
                  placeholder="Search for a movie..."
                  value={movieSearched}
                  onChange={(event) => setMovieSearched(event.target.value)}
                />
                <button
                  onClick={() => {
                    fetchMovie({
                      variables: {
                        name: movieSearched,
                      },
                    });
                  }}
                >
                  Search
                </button>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Year Of Publication</th>
                  <th>Is In Theaters</th>
                </tr>
              </thead>
              <tbody>
                {movieError && movieSearched.length > 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      Movie does not exist!
                    </td>
                  </tr>
                ) : movieSearchedData ? (
                  <tr key={movieSearchedData.movie.id}>
                    <td>{movieSearchedData.movie.name}</td>
                    <td>{movieSearchedData.movie.yearOfPublication}</td>
                    <td>
                      {movieSearchedData.movie.isInTheaters ? "Yes" : "No"}
                    </td>
                  </tr>
                ) : (
                  movieData &&
                  movieData.movies.map((movie) => (
                    <tr key={movie.id}>
                      <td>{movie.name}</td>
                      <td>{movie.yearOfPublication}</td>
                      <td>{movie.isInTheaters ? "Yes" : "No"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {isModalOpen && (
        <Modal
          closeModal={closeModal}
          createUser={createUser}
          updateUser={updateUser}
          selectedUser={selectedUser}
          mode={mode}
        />
      )}
    </div>
  );
}

export default DisplayData;
