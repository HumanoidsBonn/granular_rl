import React from 'react';
import {hexToRgba, useTextColors} from './ColorContext';

const Thanks: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { textColor } = useTextColors();
    const thanksColor = hexToRgba(textColor, 0.85);

    return (
        <div className={`text-center text-sm mb-4`} style={{color: thanksColor}}>
            {children}
        </div>
    );
};

export default Thanks;
