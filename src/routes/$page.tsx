import { createFileRoute, notFound } from "@tanstack/react-router";
import SiteApp from "../SiteApp";
import { PAGE_SEO_CONFIG } from "../data/seoData";
import type { PageType } from "../types";

const contentPages = new Set([
  "about", "portfolio", "pricing", "process", "training", "careers", "blog",
  "contact", "areas-we-serve", "terms", "privacy",
]);

export const Route = createFileRoute("/$page")({
  loader: ({ params }) => {
    if (!contentPages.has(params.page)) throw notFound();
    return { page: params.page as PageType };
  },
  head: ({ loaderData }) => {
    const page = loaderData?.page;
    if (!page) return {};
    const seo = PAGE_SEO_CONFIG[page];
    return {
      meta: [
        { title: seo.title },
        { name: "description", content: seo.description },
        { property: "og:title", content: seo.title },
        { property: "og:description", content: seo.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: seo.canonical },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: seo.canonical }],
    };
  },
  component: ContentRoute,
});

function ContentRoute() {
  const { page } = Route.useLoaderData();
  return <SiteApp initialPage={page} />;
}