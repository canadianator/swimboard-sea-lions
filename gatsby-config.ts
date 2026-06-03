import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  pathPrefix: "/swimboard-sea-lions",
  siteMetadata: {
    title: `swimboard-sea-lions`,
    siteUrl: `https://www.yourdomain.tld`
  },
  // More easily configure plugins here: https://gatsby.dev/configure-typescript
  plugins: [
    "gatsby-plugin-styled-components" // Added this line
  ]
};

export default config;
