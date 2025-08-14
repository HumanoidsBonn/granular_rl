import React from 'react';
import { useTextColors } from "./ColorContext";


interface AuthorProps {
    children: React.ReactNode;
    website: string;
    firstAuthor?: boolean;
    affiliations?: string;
    lastAuthor?: boolean;
}

const Author: React.FC<AuthorProps> = ({ children, website, firstAuthor, affiliations, lastAuthor}) => {
    const { textColor, linkColor } = useTextColors();
    return (
        <span className="text-center inline-block mb-0 mt-0 leading-tight">
      <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-normal text-xl no-underline underline-offset-3 hover:transition-all`}
          style={{color: linkColor}}
      >
        {children}
      </a>
            {(firstAuthor || affiliations) && (
                <sup className="pl-0.5">
                    {firstAuthor && <span className="font-bold">*</span>}
                    {affiliations && affiliations}
                </sup>
            )}
            {!lastAuthor && <>,&nbsp;</>}
    </span>
    );
};

export default Author;
