import Form from "../../widgets/Form/Form";
import FormOutput from "../../widgets/FormOutput/FormOutput";
import Canvas from "../../widgets/Canvas/Canvas"
import "./MainPage.css";
const MainPage = () => {
  return (
    <div className="main">
      <div className="container">
        <Form />
        <FormOutput />
        <Canvas />
      </div>
    </div>
  );
};

export default MainPage;
