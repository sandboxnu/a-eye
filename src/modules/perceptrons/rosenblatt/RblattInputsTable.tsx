import React from "react";
import { RblattInput } from "./constants";

const RblattInputsTable = (props: {
  data: RblattInput[];
  labelColor: string;
}) => (
  <div
    className={`mx-auto overflow-y-scroll max-h-sm max-w-2xl ${props.labelColor}`}
  >
    <table className="a-eye-table">
      <thead>
        <tr>
          <th> X </th>
          <th> Y </th>
          <th> Class </th>
        </tr>
      </thead>
      <tbody>
        {props.data.map(([x, y, z], idx) => (
          <tr key={idx} className="datarow">
            <td> {x} </td>
            <td> {y} </td>
            <td>
              <div
                className={`font-bold text-white ${
                  z ? "bg-lightNavy" : "bg-orange-500"
                }`}
              >
                {z}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RblattInputsTable;
