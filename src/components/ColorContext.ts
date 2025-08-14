import { createContext, useContext } from 'react';

// To convert HEX to RGBA, when using reduced opacity.
export const hexToRgba = (hex: string, opacity: number) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

interface ColorContextProps {
    textColor: string;
    linkColor: string;
}

// Specify the color of text and links via HEX codes.
const defaultColors: ColorContextProps = {
    textColor: '#111827',
    linkColor: '#2563eb',
};

const ColorContext = createContext<ColorContextProps>(defaultColors);
export const useTextColors = () => useContext(ColorContext);
