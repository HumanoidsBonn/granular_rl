import Carousel from "react-multi-carousel";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import React, { useEffect, useRef, useState } from "react";
import "react-multi-carousel/lib/styles.css";
import { useTextColors } from "./ColorContext";

interface CarouselComponentProps {
    heading: string;
    items: Array<{ video: string; label: string }>;
}

const CarouselComponent: React.FC<CarouselComponentProps> = ({ heading, items }) => {
    const carouselRef = useRef<any>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [visibleItems, setVisibleItems] = useState(2);
    const { textColor, linkColor } = useTextColors();

    const totalItems = items.length;

    const carouselResponsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 2,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
        },
    };

    const handleAfterChange = (previousSlide: number, { currentSlide }: any) => {
        setCurrentSlide(currentSlide);
    };

    const updateVisibleItems = () => {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1024) {
            setVisibleItems(carouselResponsive.desktop.items);
        } else if (screenWidth >= 464) {
            setVisibleItems(carouselResponsive.tablet.items);
        } else {
            setVisibleItems(carouselResponsive.mobile.items);
        }
    };

    useEffect(() => {
        updateVisibleItems();
        window.addEventListener("resize", updateVisibleItems);
        return () => {
            window.removeEventListener("resize", updateVisibleItems);
        };
    }, []);

    return (
        <div className="carousel-container">
            <div className="flex justify-between items-center mt-12">
                <div className="flex justify-left text-3xl" style={{ color: textColor }}>
                    {heading}
                </div>

                <nav className="space-x-4">
                    <button
                        type="button"
                        className="text-3xl"
                        onClick={() => carouselRef.current?.previous()}
                        style={{
                            color: currentSlide === 0 ? "#A0AEC0" : linkColor, // Disabled state gray color, active uses linkColor
                            cursor: currentSlide === 0 ? "not-allowed" : "pointer",
                        }}
                        disabled={currentSlide === 0}
                    >
                        <IoIosArrowBack className="ml-1" />
                    </button>

                    <button
                        type="button"
                        className="text-3xl"
                        onClick={() => carouselRef.current?.next()}
                        style={{
                            color: currentSlide + visibleItems >= totalItems ? "#A0AEC0" : linkColor,
                            cursor: currentSlide + visibleItems >= totalItems ? "not-allowed" : "pointer",
                        }}
                        disabled={currentSlide + visibleItems >= totalItems}
                    >
                        <IoIosArrowForward className="ml-1" />
                    </button>
                </nav>
            </div>

            <div className="py-6">
                <div className="relative overflow-hidden">
                    <Carousel
                        ref={carouselRef}
                        responsive={carouselResponsive}
                        infinite={false}
                        showDots={false}
                        arrows={false}
                        renderDotsOutside={false}
                        swipeable={true}
                        draggable={true}
                        afterChange={handleAfterChange}
                        beforeChange={(previousSlide, { currentSlide }: any) => {
                            const videos = document.getElementsByClassName("carousel-video");
                            for (let i = 0; i < videos.length; i++) {
                                const videoElement = videos[i] as HTMLVideoElement;
                                if (videoElement.paused) {
                                    videoElement.play();
                                }
                            }
                        }}
                    >
                        {items.map((item, index) => (
                            <CarouselItem key={index} video={item.video}>
                                {item.label}
                            </CarouselItem>
                        ))}
                    </Carousel>
                </div>
            </div>
        </div>
    );
};

const CarouselItem: React.FC<{ video: string; children: React.ReactNode }> = ({
                                                                                  video,
                                                                                  children,
                                                                              }) => {
    return (
        <div className="carousel-item px-2">
            <video
                className="carousel-video rounded-lg"
                src={video}
                width="100%"
                loop
                muted
                playsInline
            />
            <p className="text-center mt-2">{children}</p>
        </div>
    );
};

export default CarouselComponent;
