import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./modal.css";

const Input = ({ label, type, id, name, value, onChange }) => (
  <div className="form-group">
    <label htmlFor={id}>{label}:</label>
    <input type={type} id={id} name={name} value={value} onChange={onChange} />
  </div>
);

const Modal = ({ closeModal, createUser, updateUser, selectedUser, mode }) => {
  const [formData, setFormData] = useState(selectedUser || { 
    name: "",
    username:  "",
    age: 0,
    nationality: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "create") {
        await createUser({
          variables: {
            user: { ...formData, age: parseInt(formData.age) },
          },
        });
      } else if (mode === "update") {
        const { __typename, id, ...formDataWithoutId } = formData;
        await updateUser({
          variables: {
            id: parseInt(id),
            edits: { ...formDataWithoutId, age: parseInt(formData.age) },
          },
        });
      }

      closeModal();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={closeModal}>
          Close
        </button>

        <div className="modal-content">
          <h2>{mode === "create" ? "Add New User" : "Update User"}</h2>
          <form onSubmit={handleSubmit}>
            <Input
              label="Name"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              label="Username"
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            <Input
              label="Age"
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
            <div className="form-group">
              <label htmlFor="nationality">Nationality:</label>
              <select
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Your Nationality
                </option>
                <option value="CANADA">CANADA</option>
                <option value="BRAZIL">BRAZIL</option>
                <option value="INDIA">INDIA</option>
                <option value="GERMANY">GERMANY</option>
                <option value="CHILE">CHILE</option>
                <option value="UKRAINE">UKRAINE</option>
              </select>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;
