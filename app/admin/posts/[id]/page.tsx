import { redirect } from "next/navigation";

type LegacyPostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function LegacyEditPostPage({ params }: LegacyPostPageProps) {
  const { id } = await params;
  redirect(`/admin/blogs/${id}/edit`);
}
