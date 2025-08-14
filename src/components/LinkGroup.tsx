import { IoIosArrowForward } from "react-icons/io";
import PaperDropdown from "./PaperDropdown";
import React from 'react';
import { useTextColors } from "./ColorContext";

interface LinksProps {
    arxivUrl: string;
    pdfUrl: string;
    otherUrls: [string, string][];
}

const LinkGroup: React.FC<LinksProps> = ({ arxivUrl, pdfUrl, otherUrls }) => {
    const { textColor, linkColor } = useTextColors();
    return (
        <div className="flex justify-center mt-4 mb-12">
            <PaperDropdown arxivUrl={arxivUrl} pdfUrl={pdfUrl} />

            {otherUrls.map(([url, text], index) => (
                <a href={url}
                   className={`underline-offset-small inline-flex items-center text-base mr-6`}
                   style={{color: linkColor}}>
                    {text} <IoIosArrowForward className="ml-1"/>
                </a>
            ))}
        </div>
    );
};

export default LinkGroup;
