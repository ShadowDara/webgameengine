// app/u/[slug]/page.tsx

// Make it static!
export const dynamic = "force-static";

export default async function UserSlug({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  return (
    <div>
      <p>User Page: {slug}</p>
    </div>
  );
}
