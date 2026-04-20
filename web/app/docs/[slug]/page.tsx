// app/docs/[slug]/page.tsx
import { getDocBySlug, getDocSlugs } from "@/lib/docs";
import ReactMarkdown from "react-markdown";

export async function generateStaticParams() {
  const slugs = getDocSlugs();

  return slugs.map((slug) => ({
    slug: slug.replace(".md", ""),
  }));
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const doc = getDocBySlug(slug);

  return (
    <div className="prose">
      <ReactMarkdown>{doc.content}</ReactMarkdown>
    </div>
  );
}
