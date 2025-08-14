import React from 'react';
import { useTextColors } from "./ColorContext";

interface AffiliationProps {
    children: React.ReactNode;
    website: string;
    number?: number | string;
}

const Affiliation: React.FC<AffiliationProps> = ({ children, website, number }) => {
    const { textColor, linkColor } = useTextColors();
    return (
        <span className="text-center opacity-90 inline-block mr-4 mt-0 leading-tight" style={{color: textColor}}>
            {number && <sup className="mr-1">{number}</sup>}
            <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className={`font-normal no-underline underline-offset-3 hover:transition-all`}
                style={{color: textColor}}
            >
        {children}
      </a>
    </span>
    );
};

export default Affiliation;
