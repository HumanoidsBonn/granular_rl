import * as React from "react"
import type {HeadFC, PageProps} from "gatsby"
import Abstract from "../components/Abstract"
import Affiliation from "../components/Affiliation";
import Author from "../components/Author";
import CarouselComponent from "../components/Carousel";
import Citation from "../components/Citation";
import Footer from "../components/Footer";
import Heading from "../components/Heading";
import LinkGroup from "../components/LinkGroup";
import Thanks from "../components/Thanks"
import Title from "../components/Title"
import VideoGrid from "../components/VideoGrid"
import PlyViewer from '../components/PlyViewer';
import PlyGrid, { PlyItem } from '../components/PlyGrid';


const Article: React.FC = ({children}) => {
    return (
        <div
            className="mx-auto w-full max-w-[90%]
                       lg:max-w-4xl">
            {children}
        </div>
    )
}


export const Head: HeadFC = () => <title>Interactive Shaping of Granular Media with Reinforcement Learning</title>

const IndexPage: React.FC<PageProps> = () => {
    return (
        <div>
            <main className="">
                <Article>
                    {/* Title */}
                    <Title>Interactive Shaping of Granular Media with Reinforcement Learning</Title>

                    {/* Authors */}
                    <div className="flex flex-wrap justify-center text-lg mb-2.5 mt-0 leading-none">
                       <Author website={"https://www.hrl.uni-bonn.de/people/kreis"} firstAuthor={true} affiliations={""}>Benedikt Kreis</Author>
                       <Author website={"https://maltemosbach.github.io/"} firstAuthor={false} affiliations={""}>Malte Mosbach</Author>
                       <Author website={"https://www.linkedin.com/in/anny-ripke-678122339"} firstAuthor={false} affiliations={""}>Anny Ripke</Author>
                       <Author website={"https://www.linkedin.com/in/iamehsanullah"} firstAuthor={false} affiliations={""}>M. Ehsan Ullah</Author>
                       <Author website={"https://www.ais.uni-bonn.de/behnke/"} firstAuthor={false} affiliations={""}>Sven Behnke</Author>
                       <Author website={"https://www.hrl.uni-bonn.de/people/bennewitz"} firstAuthor={false} lastAuthor={true} affiliations={""}>Maren Bennewitz</Author>
                    </div>

                    <Thanks>* Corresponding author</Thanks>

                    {/* Affiliations */}
                    <div className="flex flex-wrap justify-center text-base mb-4 mt-0 leading-none">
                        University of Bonn
                    </div>

                    {/* Conference */}
                    <div className="flex flex-wrap justify-center text-base mb-4 mt-0 leading-none">
                        IEEE-RAS International Conference on Humanoid Robots (Humanoids), 2025
                    </div>

                    {/*/!* Links *!/*/}
                    <LinkGroup
                        arxivUrl=""
                        pdfUrl=""
                        otherUrls={[
                            ["/bibtex.txt", "BibTex"],
                            ["https://github.com/HumanoidsBonn/granular_rl", "Code"],
                            // ["", "Video"]
                        ]}
                    >
                    </LinkGroup>
                    
                    {/* Abstract */}
                    <Abstract>
                        Autonomous manipulation of granular media, such as sand, is crucial for applications in construction, excavation, and additive manufacturing.
                        However, shaping granular materials presents unique challenges due to their high-dimensional configuration space and complex dynamics, where traditional rule-based approaches struggle without extensive engineering efforts.
                        Reinforcement learning (RL) offers a promising alternative by enabling agents to learn adaptive manipulation strategies through trial and error.
                        In this work, we present an RL framework that enables a robotic arm with a cubic end-effector to shape granular media into desired structures, outperforming two baseline approaches.
                        We show the importance of compact observations and concise reward formulations for the large configuration space, validating our design choices with a rigorous ablation study of our feature extractor and the selection of RL algorithm.
                        Our results demonstrate the effectiveness of the proposed approach for the training of visual policies that manipulate granular media including their real-world deployment.
                    </Abstract>

                    {/* Teaser Video */}
                    <video autoPlay controls muted playsInline loop alt="Teaser Video" className="border-2 border-slate-100 mt-0 rounded-xl mx-auto max-w-[100%] sm:max-w-[90%]">
                        <source src="/videos/teaser.mp4" type="video/mp4"/>
                    </video>

                    <VideoGrid
                    heading="Simulation Deployment"
                    text="Our approach demonstrates reliable manipulation of the granular medium with a wide range of goal shapes. In the end of each run, the desired goal shape is visible within the medium.
                    The videos show the simulated render view (left), the reconstructed height map (center), and the goal height map (right)."
                    items={[
                        { video: "/videos/sim_rectangle_combined.mp4", label: "Rectangle" },
                        { video: "/videos/sim_trench_combined.mp4", label: "Long rectangle" },
                        { video: "/videos/sim_L_combined.mp4", label: "L-shape" },
                        { video: "/videos/sim_fresco_combined.mp4", label: "Fresco fragment" },
                    ]}
                    scale={0.3}
                    />

                    <VideoGrid
                    heading="Real World Deployment"
                    text="Deployed to the real robotic system, our approach successfully creates the desired goal shape in the granular medium.
                    The video shows an external camera view (left), the reconstructed height map (center), and the goal height map (right)."
                    items={[
                        { video: "/videos/real_trench_combined.mp4", label: "Long rectangle" },
                    ]}
                    scale={0.1}
                    />

                    <PlyGrid
                    heading="Qualitative Experimental Results"
                    text="Explore the resulting shapes within the goal area of the granular medium.
                        The goal height maps (blue) and the achieved height maps (gray) are rendered as point clouds.
                        You can rotate, zoom, and pan to examine the structure from any angle."
                    items={
                        [
                        {
                            urls: ['/models/rectangle_pcd_goal.ply', '/models/rectangle_pcd_achieved.ply'],
                            label: 'Rectangle',
                        },
                        {
                            urls: ['/models/trench_pcd_goal.ply', '/models/trench_pcd_achieved.ply'],
                            label: 'Long rectangle',
                        },
                        {
                            urls: ['/models/L_pcd_goal.ply', '/models/L_pcd_achieved.ply'],
                            label: 'L-shape',
                        },
                        {
                            urls: ['/models/fragment_pcd_goal.ply', '/models/fragment_pcd_achieved.ply'],
                            label: 'Fresco fragment',
                        },
                        ]
                    }
                    cellSize={360}
                    />
                    
                    {/* Carousel */}
                    {/* <CarouselComponent
                        heading={"Simulation Deployment"}
                        items={[
                            { video: "/videos/teaser.mp4", label: "Fresco Fragment" },
                            { video: "/videos/teaser.mp4", label: "Fresco Fragment" },
                            { video: "/videos/teaser.mp4", label: "Fresco Fragment" },
                            { video: "/videos/teaser.mp4", label: "Fresco Fragment" },
                        ]}
                    /> */}

                    {/* Long Video */}
                    {/* <Heading>Video</Heading>
                    <div className="flex justify-left text-base">
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                        At vero eos et accusam et justo duo dolores et ea rebum.
                    </div>
                    <video controls muted loop alt="Long Video" className="border-2 border-slate-100 mt-4 rounded-xl mx-auto max-w-[100%] sm:max-w-[75%]">
                        <source src="/videos/teaser.mp4" type="video/mp4"/>
                    </video> */}

                    {<Citation/>}

                    </Article>

                <Footer
                    githubUrl="https://github.com/benediktkreis"
                    googleScholarUrl="https://scholar.google.de/citations?hl=de&user=Ozj9MvYAAAAJ"
                    linkedInUrl="https://www.linkedin.com/in/benedikt-kreis-235603164/"
                />
            </main>
        </div>
    );
};

export default IndexPage;
