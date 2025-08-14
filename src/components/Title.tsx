import React from 'react';
import { useTextColors } from './ColorContext';

const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { textColor } = useTextColors();

    return (
        <div className={`mt-10 pb-1 mb-4 text-center text-4xl`} style={{color: textColor}}>
            {children}
        </div>
    );
};

export default Title;
