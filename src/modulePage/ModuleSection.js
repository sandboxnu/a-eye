import React from "react";

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export default function ModuleSection(props) {
    const scheme = props.colorScheme === 'dark' ? {
        "bgColor": "bg-moduleDarkBlue",
        "titleColor": "text-modulePaleBlue",
        "headingColor": "text-moduleTeal",
        "bodyColor": "text-moduleOffwhite"
    } : {
        "bgColor": "bg-modulePaleBlue",
        "titleColor": "text-moduleNavy",
        "headingColor": "text-moduleDarkBlue",
        "bodyColor": "text-moduleNavy"
    };

    return (
        <div className={`flex flex-col w-screen ${scheme.bgColor}`}>
            <div className="mx-40">
                <p className={`my-12 text-6xl italic font-bold font-opensans ${scheme.titleColor}`}>{props.title}</p>
                <ul className="">
                    {
                        props.sections.map((section, index) => {
                            const imgL = <img src={process.env.PUBLIC_URL + section.imgSrc}
                                             className={`w-1/4 mr-16 object-contain`} alt="img"/>;
                            const imgR = <img src={process.env.PUBLIC_URL + section.imgSrc}
                                              className={`w-1/4 ml-16 object-contain`} alt="img"/>;
                            return (
                                <div className="flex flex-row mx-4 my-16">
                                    {index % 2 !== 0 && imgL}
                                    <div className="w-2/3 flex-col">
                                        <p className={`my-4 text-left text-4xl font-extrabold font-opensans uppercase ${scheme.headingColor}`}>{section.heading}</p>
                                        <p className={`my-4 text-left text-sm font-medium font-mono ${scheme.bodyColor}`}>{lorem || section.body}</p>
                                    </div>
                                    {index % 2 === 0 && imgR}
                                </div>
                            );
                        })
                    }
                </ul>
            </div>
        </div>
    );
}