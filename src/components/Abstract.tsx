import React from "react";
import {useTextColors} from "./ColorContext";

const Abstract: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { textColor } = useTextColors();
    return (
        <div className="pb-12">
            <div className="flex justify-center content-center text-3xl" style={{color: textColor}}>
                <h3>Abstract</h3>
            </div>
            <div className="flex justify-center content-center mt-4">
                <p className="text-justify font-normal text-base m-1 sm:m-1 max-w-xl" style={{color: textColor}}>
                    {children}
                </p>
            </div>
        </div>
    );
};

export default Abstract;
