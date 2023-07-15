import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux/store";
import "./FormOutput.css";
const connector = connect((state: RootState) => ({
  formData: state.form.formData,
}));

type PropsFromRedux = ConnectedProps<typeof connector>;

type FormOutputProps = PropsFromRedux;

const FormOutput: React.FC<FormOutputProps> = ({ formData }) => {
  return (
    <div>
      <h2>Form Data:</h2>
      <div className="table">
        <div className="table_header">
          <span>Name</span>
          <span>Coordinate</span>
          <span>Labels</span>
        </div>
        {formData.map((entity, index) => (
          <div key={index} className="table_item">
            <span>{entity.name}</span>
            <span>{entity.coordinate}</span>
            <span> {entity.labels.join(", ")}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default connector(FormOutput);
