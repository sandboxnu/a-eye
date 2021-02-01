import React from 'react';
import mod8 from '../media/modules/mod8.png'
import mod9 from '../media/modules/mod9.png'
import mod10 from '../media/modules/mod10.png'
import mod11 from '../media/modules/mod11.png'

export default function ModuleIntro(props) {
    return (
        <div className={`flex-col w-full md:w-2/3 mx-4 md:mx-0 py-6 shadow-module rounded-module ${props.bgColor} ${props.textColor} md:${props.margin}`}>
            <h1 className="text-3.5xl float-left italic font-bold font-opensans mt-5 ml-10">{props.title}</h1>
            <div className="flex-col md:flex-row inline-flex justify-between m-8 mt-4">
                <img src={GetCoverImage(props.imgSrc)} className="md:w-1/4 ml-4 object-contain" alt="img"/>
                <p className="md:w-2/3 text-base font-mono my-4 text-left">{props.body}</p>
            </div>
        </div>
    );
};

function GetCoverImage(imgName) {
    switch(imgName) {
        case 'mod8':
            return mod8;
        case 'mod9':
            return mod9;
        case 'mod10':
            return mod10;
        case 'mod11':
            return mod11;
        default:
            return;
    }
}
