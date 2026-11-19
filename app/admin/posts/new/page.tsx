import type { Metadata } from "next";
import { PostForm } from "@/components/admin/post-form";

export const metadata: Metadata = {
  title: "New post",
};

export default function NewPostPage() {
  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-ink-900">New post</h2>
      <PostForm />
    </div>
  );
}
