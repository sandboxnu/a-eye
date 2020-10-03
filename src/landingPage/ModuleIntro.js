import React from 'react';

export default function ModuleIntro(props) {
    return (
        <div className={`flex-col w-1/2 rounded-lg ${props.bgColor} ${props.textColor}`}>
            <h1 className="text-xl font-opensans">{props.title}</h1>
            <div className="flex-row inline-flex justify-between m-8">
                <img className="w-1/3" alt="img"/>
                <p className="w-2/3 text-sm font-roboto my-4">{props.body}</p>
            </div>
        </div>
    );
};