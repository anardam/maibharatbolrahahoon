import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.maibharatbolrahahoon.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/articles/new", "/categories", "/review", "/users", "/sign-in"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
