import type {GatsbyConfig} from "gatsby";

const config: GatsbyConfig = {
    siteMetadata: {
        title: `Interactive Shaping of Granular Media with Reinforcement Learning`,
        siteUrl: `https://granular-rl.github.io/`,
    },
    pathPrefix: "/",
    graphqlTypegen: true,
    plugins: [
        "gatsby-plugin-postcss",
        "gatsby-plugin-sitemap",
        {
            resolve: "gatsby-plugin-google-gtag",
            options: {
                trackingIds: [
                    "G-T7NKWVQH1D",
                ],
            }
        },
        {
            resolve: 'gatsby-plugin-manifest',
            options: {
                "icon": "src/images/icon.png"
            }
        }, "gatsby-plugin-mdx", {
            resolve: 'gatsby-source-filesystem',
            options: {
                "name": "pages",
                "path": "./src/pages/"
            },
            __key: "pages"
        }]
};

export default config;
