import React, { useEffect, useRef } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux/store";
import { FormEntity } from "../../types";

const connector = connect((state: RootState) => ({
  formData: state.form.formData,
}));

type PropsFromRedux = ConnectedProps<typeof connector>;

type CanvasProps = PropsFromRedux;

const Canvas: React.FC<CanvasProps> = ({ formData }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate the canvas center coordinates
    const canvasCenterX = canvas.width / 2;
    const canvasCenterY = canvas.height / 2;

    // Draw the data
    formData.forEach((entity: FormEntity, index: number) => {
      const { coordinate } = entity;

      // Parse the coordinate values
      const [x, y] = coordinate
        .split(",")
        .map((coord) => parseInt(coord.trim(), 10));

      // Calculate the adjusted coordinates within the canvas bounds
      const adjustedX = canvasCenterX + x;
      const adjustedY = canvasCenterY + y;
      ctx.fillStyle = "#FFFFFF";
      ctx.strokeStyle = "#FFFFFF";
      
      // Draw a point at the adjusted coordinate
      ctx.fillRect(adjustedX, adjustedY, 5, 5);

      // Connect the rectangles with lines
      if (index > 0) {
        const prevEntity = formData[index - 1];
        const prevCoordinates = prevEntity.coordinate
          .split(",")
          .map((coord) => parseInt(coord.trim(), 10));

        // Calculate the adjusted previous coordinates
        const adjustedPrevX = canvasCenterX + prevCoordinates[0];
        const adjustedPrevY = canvasCenterY + prevCoordinates[1];

        ctx.beginPath();
        ctx.moveTo(adjustedPrevX, adjustedPrevY);
        ctx.lineTo(adjustedX, adjustedY);
        ctx.stroke();
      }

      // Connect the first and last rectangles with a line
      if (index === formData.length - 1 && formData.length > 1) {
        const firstEntity = formData[0];
        const firstCoordinates = firstEntity.coordinate
          .split(",")
          .map((coord) => parseInt(coord.trim(), 10));

        // Calculate the adjusted first coordinates
        const adjustedFirstX = canvasCenterX + firstCoordinates[0];
        const adjustedFirstY = canvasCenterY + firstCoordinates[1];

        ctx.beginPath();
        ctx.moveTo(adjustedX, adjustedY);
        ctx.lineTo(adjustedFirstX, adjustedFirstY);
        ctx.stroke();
      }
    });
  }, [formData]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ border: "1px solid #fff", borderRadius: "8px" }}
    ></canvas>
  );
};

export default connector(Canvas);
