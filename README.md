# Project Page

This page is designed to easily showcase academic project and builds upon the [F3RM Website](https://github.com/f3rm/f3rm.github.io).


## 🚀 Quickstart

This website is built using [Gatsby.js](https://www.gatsbyjs.com/) and styled with [Tailwind CSS](https://tailwindcss.com/).
Follow these steps to get up and running:

1. **Install Node.js** via the instructions
   [here](https://www.gatsbyjs.com/docs/tutorial/getting-started/part-0/#nodejs)
2. **Install yarn** with `npm install yarn`
3. **Install project dependencies** with `yarn install`
4. **Start the development server** with `yarn develop` and customize the website
    - The website will be available at http://localhost:8000/
    - Customizations to the content in [`src/pages/index.tsx`](src/pages/index.tsx) should now reflect in real-time
    - The color scheme can easily be adjusted in [`src/components/ColorContext.ts`](src/components/ColorContext.ts)

## 📦️ Build and Deployment

To build the website locally, run `yarn build`

To deploy the website to [GitHub Pages](https://pages.github.com/), run one of the following commands:
- `yarn deploy-ssh` for SSH-based authentication
- `yarn deploy` for HTTPS-based authentication


> [!NOTE]  
> Before deploying, make sure to update the Git repository URL in [package.json](package.json) to point to your own repository if you're using this template for your project.

## ⚖️ License

This project is licensed under the MIT License. For more details, see the [LICENSE](LICENSE) file.
