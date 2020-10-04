import React from 'react';

export default function ModuleIntro(props) {
    return (
        <div className={`flex-col w-2/3 py-6 shadow-module rounded-module ${props.bgColor} ${props.textColor} ${props.margin}`}>
            <h1 className="text-3.5xl float-left italic font-bold font-opensans mt-5 ml-10">{props.title}</h1>
            <div className="flex-row inline-flex justify-between m-8 mt-4">
                <img src={process.env.PUBLIC_URL + props.imgSrc} className="w-1/4 ml-4 object-contain" alt="img"/>
                <p className="w-2/3 text-sm font-mono my-4 text-left">{props.body}</p>
            </div>
        </div>
    );
};