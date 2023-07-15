// components/Form.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";
import { connect, ConnectedProps } from "react-redux";
import { addFormData, removeFormData, editFormData } from "../../redux/actions";
import { FormEntity } from "../../types";
import { RootState } from "../../redux/store";
import "./Form.css";



const API_BASE_URL = "https://64b2793b38e74e386d5526c4.mockapi.io/api/can";
const API_ENDPOINT = `${API_BASE_URL}/entitys`;




const mapStateToProps = (state: RootState) => ({
  formData: state.form.formData,
});
const connector = connect(mapStateToProps, {
  addFormData,
  removeFormData,
  editFormData,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type FormProps = PropsFromRedux;

const Form: React.FC<FormProps> = ({
  addFormData,
  removeFormData,
  editFormData,
  formData,
}) => {
  const [name, setName] = useState("");
  const [xCoordinate, setXCoordinate] = useState("");
  const [yCoordinate, setYCoordinate] = useState("");
  const [labelCount, setLabelCount] = useState(0);
  const [labels, setLabels] = useState<string[]>([]);

  
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setName(value);

  };

  const handleXCoordinateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = parseFloat(inputValue);
  
    if (!isNaN(numericValue) || inputValue === '-') {
      setXCoordinate(inputValue);
    } else {
      setXCoordinate("");
    }
  };
  
  const handleYCoordinateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = parseFloat(inputValue);
  
    if (!isNaN(numericValue) || inputValue === '-') {
      setYCoordinate(inputValue);
    } else {
      setYCoordinate("");
    }
  };

  const handleLabelCountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    setLabelCount(count);
    setLabels(Array(count).fill(""));
  };

  const handleLabelChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const updatedLabels = [...labels];
    updatedLabels[index] = e.target.value;
    setLabels(updatedLabels);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let updatedName = name; // Store the current value of name

    if (name.length === 0) {
      updatedName = `Entity(${formData.length + 1})`;
    }
  
    const newEntity: FormEntity = {
      name: updatedName, // Use updatedName instead of name
      coordinate: `${xCoordinate}, ${yCoordinate}`,
      labels,
    };
  
  
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(newEntity),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create entity");
      }
  
      // Parse the response JSON data
      const responseData = await response.json();
  
      // Add the new entity to your Redux store using the addFormData action
      addFormData(responseData);
  
      // Clear the form fields
      setName("");
      setXCoordinate("");
      setYCoordinate("");
      setLabelCount(0);
      setLabels([]);
  
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };
  

  const handleRemoveEntity = (index: number) => {
    removeFormData(index);
  };

  const handleEditEntity = (index: number) => {
    const entityToEdit = formData[index];

    // Set the form values to the entity being edited
    setName(entityToEdit.name);

    const [x, y] = entityToEdit.coordinate.split(",").map((coord) => parseFloat(coord.trim()));
    setXCoordinate(x.toString());
    setYCoordinate(y.toString());

    setLabelCount(entityToEdit.labels.length);
    setLabels([...entityToEdit.labels]);

    // Create an updated entity with the edited values
    const updatedEntity: FormEntity = {
      name,
      coordinate: `${xCoordinate}, ${yCoordinate}`,
      labels,
    };

    // Update the form data by replacing the entity at the specified index
    editFormData({ index, updatedData: updatedEntity });

    // Clear the form fields
    setName("");
    setXCoordinate("");
    setYCoordinate("");
    setLabelCount(0);
    setLabels([]);
  };


  return (
    <form action="/forms" method="POST" onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={name} onChange={handleNameChange} />
      </label>
      <label>
        X Coordinate:
        <input
          type="text"
          value={xCoordinate}
          onChange={handleXCoordinateChange}
        />
      </label>
      <label>
        Y Coordinate:
        <input
          type="text"
          value={yCoordinate}
          onChange={handleYCoordinateChange}
        />
      </label>
      <label>
        Number of Labels:
        <input
          type="number"
          value={labelCount}
          onChange={handleLabelCountChange}
        />
      </label>
      {labels.map((label, index) => (
        <div key={index}>
          <label>
            Label {index + 1}:
            <input
              type="text"
              value={label}
              onChange={(e) => handleLabelChange(index, e)}
            />
          </label>
        </div>
      ))}
      <div className="submit">
        <button  type="submit">
          Create a new entity
        </button>
      </div>

      {formData.map((entity: FormEntity, index: number) => (
        <div className="wrap" key={index}>
          <p>Name: {entity.name}</p>
          <p>Coordinate: {entity.coordinate}</p>
          <p>Labels: {entity.labels.join(", ")}</p>
          <div className="wrap_btn">
            <button  type="button" onClick={() => handleRemoveEntity(index)}>
              Remove Entity
            </button>
            <button type="button" onClick={() => handleEditEntity(index)}>
              Edit Entity
            </button>
          </div>
        </div>
      ))}
    </form>
  );
};

export default connector(Form);
