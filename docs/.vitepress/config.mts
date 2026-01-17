import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config

import { set_sidebar } from "./utils/auto_sidebar.mts";

export default defineConfig({
  title: "redblacktree's site",
  description: "A VitePress Site",
  srcDir: "./src",
  
  themeConfig: {
    logo: "/logo.svg",
    nav: [{ text: "Home", link: "/" }],
    search: {
      provider: "local",
    },
    

    // sidebar: [
    //   {
    //     text: "Examples",
    //     items: [
    //       { text: "Markdown Examples", link: "/markdown-examples" },
    //       { text: "Runtime API Examples", link: "/api-examples" },
    //     ],
    //   },
    //         {
    //     text: "Examples2",
    //     items: [
    //       { text: "Markdown Examples", link: "/math/1" },
    //       { text: "Runtime API Examples", link: "/math/2" },
    //     ],
    //   },
    // ],

    sidebar: [
      {
        text: "math",
        items: set_sidebar("math"),
        collapsed: true,
      },
      {
        text: "computer",
        items: set_sidebar("computer"),
        collapsed: true,
      },
      {
        text: "project",
        items: set_sidebar("project"),
        collapsed: true,
      },
      {
        text: "dataAnalysis",
        items: set_sidebar("dataAnalysis"),
        collapsed: true,
      },
      {
        text: "think",
        items: set_sidebar("think"),
        collapsed: true,
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/livforcode" }],
  },
});
