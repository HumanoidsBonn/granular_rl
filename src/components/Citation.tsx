import Heading from "./Heading";
import { LuCopy, LuCopyCheck } from 'react-icons/lu';
import React, { useEffect, useState } from "react";
import { useTextColors, hexToRgba } from './ColorContext';


const Citation: React.FC = ({}) => {
    const { textColor, linkColor } = useTextColors();
    const [bibtex, setBibtex] = useState("");
    const [copied, setCopied] = useState(false);

    const backgroundColor = hexToRgba(linkColor, 0.05);

    useEffect(() => {
        fetch("/bibtex.txt")
            .then((response) => response.text())
            .then((data) => setBibtex(data))
            .catch((error) => console.error("Error loading BibTeX file:", error));
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(bibtex)
            .then(() => {
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                }, 3000);
            })
            .catch((err) => {
                console.error("Failed to copy text: ", err);
            });
    };

    return (
        <div>
            <Heading>Citation</Heading>
            <div className="relative p-6 rounded-xl bg-opacity-5 !my-0"
                 style={{backgroundColor: backgroundColor}}>
                <button className={`absolute top-0 right-0 float-right text-2xl p-1 m-3`} style={{color: linkColor}}
                        onClick={copyToClipboard}>
                    {copied ? <LuCopyCheck/> : <LuCopy/>}
                </button>
                <pre className="whitespace-pre-wrap" style={{color: textColor}}>
                    <code id="citation-bib">
                        {bibtex || "Loading..."}
                    </code>
                </pre>

            </div>
        </div>
    );
};

export default Citation;
