"use client";

import ConfirmButton from "./ConfirmButton";
import { deletePost } from "./actions";

/**
 * Deleting a post is unrecoverable — the row goes, and the cover image with
 * it. The confirm step is an in-app dialog rather than window.confirm, which
 * embedded browsers and sandboxed iframes refuse to show.
 */
export default function DeleteButton({
  postId,
  title,
}: {
  postId: string;
  title: string;
}) {
  return (
    <ConfirmButton
      action={deletePost}
      hidden={{ postId }}
      label="Delete"
      title={`Delete “${title}”?`}
      description="This can't be undone. The post and its cover image are removed permanently."
      confirmLabel="Delete post"
    />
  );
}
