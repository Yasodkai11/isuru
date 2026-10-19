import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Isuru Ceylon | Natural Ceylon Sapphires",
    short_name: "Isuru Ceylon",
    description: "Curators of unheated natural Ceylon Sapphires and rare precious island gemstones directly from Ratnapura, Sri Lanka.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF6EE",
    theme_color: "#5E0F1E",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
