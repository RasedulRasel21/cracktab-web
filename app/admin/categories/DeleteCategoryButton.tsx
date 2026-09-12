"use client";

import ConfirmButton from "../ConfirmButton";
import { deleteCategory } from "./actions";

/**
 * Deleting a category never deletes content — posts are un-filed and children
 * are promoted to top level. The dialog says exactly that, because "delete
 * category" reasonably sounds like it might take the posts with it.
 */
export default function DeleteCategoryButton({
  categoryId,
  name,
  postCount,
  childCount,
}: {
  categoryId: string;
  name: string;
  postCount: number;
  childCount: number;
}) {
  const consequences = [
    postCount > 0
      ? `${postCount} post${postCount === 1 ? "" : "s"} will lose their category. They stay published.`
      : null,
    childCount > 0
      ? `${childCount} subcategor${childCount === 1 ? "y" : "ies"} will move up to top level.`
      : null,
  ].filter(Boolean);

  return (
    <ConfirmButton
      action={deleteCategory}
      hidden={{ categoryId }}
      label="Delete"
      title={`Delete “${name}”?`}
      description={
        consequences.length
          ? consequences.join(" ")
          : "Nothing is filed under it, so nothing else changes."
      }
      confirmLabel="Delete category"
    />
  );
}
