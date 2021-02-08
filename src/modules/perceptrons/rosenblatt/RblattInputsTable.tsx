import React, { useState } from 'react';
import { RblattInput } from './constants';

const RblattInputsTable = (props: { data: RblattInput[], labelColor: string }) => {

    return (
        <div className={`mx-auto overflow-y-scroll max-h-sm max-w-2xl ${props.labelColor}`}>
            <table className="a-eye-table table-fixed">
                <thead>
                    <tr>
                        <th> X </th>
                        <th> Y </th>
                        <th> Class </th>
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((inpt, idx) => (
                        <tr key={idx} className="datarow">
                            <td> {inpt.x} </td>
                            <td> {inpt.y} </td>
                            <td> 
                                <div className={`font-bold text-white ${inpt.z ? 'bg-lightNavy' : 'bg-orange-500'}`}>
                                    {inpt.z} 
                                </div> 
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>);

}

export default RblattInputsTable;
