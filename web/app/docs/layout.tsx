// app/docs/layout.tsx
import Link from "next/link";
import { getDocSlugs } from "@/lib/docs";
import { ReactNode } from "react";

export default function DocsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const slugs = getDocSlugs();

  return (
    <div style={{ display: "flex" }}>
      <aside style={{ width: "250px", padding: "20px" }}>
        <h2><Link href="/docs">Docs</Link></h2>
        <ul>
          {slugs.map((slug) => (
            <li key={slug}>
              <Link href={`/docs/${slug.replace(".md", "")}`}>
                {slug.replace(".md", "")}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <main style={{ padding: "20px", flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
