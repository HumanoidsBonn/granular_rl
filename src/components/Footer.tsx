import { AiFillGithub, AiOutlineGoogle, AiFillLinkedin } from 'react-icons/ai';
import React from 'react';
import { useTextColors } from './ColorContext';

interface FooterProps {
    githubUrl?: string;
    googleScholarUrl?: string;
    linkedInUrl?: string;
}

const Footer: React.FC<FooterProps> = ({ githubUrl, googleScholarUrl, linkedInUrl }) => {
    const { textColor, linkColor } = useTextColors();

    return (
        <footer className="pt-8 pb-4">
            <div className="container mx-auto w-full max-w-[90%] lg:max-w-4xl flex justify-between items-center text-normal text-base">
                {/* Left side: Website template text */}
                <div className="flex items-center space-x-1" style={{ color: textColor }}>
                    <span>Website template available on</span>
                    {githubUrl && (
                        <a
                            href={"https://github.com/maltemosbach/project-page-template"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center hover:underline"
                            style={{ color: linkColor }}
                        >
                            GitHub <AiFillGithub size={16} className="ml-1" />
                        </a>
                    )}
                </div>

                {/* Right side: Social icons */}
                <div className="flex space-x-8">
                    {githubUrl && (
                        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="no-underline-effect" style={{ color: linkColor }} aria-label="GitHub">
                            <AiFillGithub size={24} />
                        </a>
                    )}
                    {googleScholarUrl && (
                        <a href={googleScholarUrl} target="_blank" rel="noopener noreferrer" className="no-underline-effect" style={{ color: linkColor }} aria-label="Google Scholar">
                            <AiOutlineGoogle size={24} />
                        </a>
                    )}
                    {linkedInUrl && (
                        <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="no-underline-effect" style={{ color: linkColor }} aria-label="LinkedIn">
                            <AiFillLinkedin size={24} />
                        </a>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
