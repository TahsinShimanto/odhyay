export const slugify = (text) =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const resolveSlug = (name, providedSlug) => {
  const slug = (providedSlug || slugify(name) || "").toLowerCase().trim();
  if (!slug) throw new Error("Slug could not be generated from the name");
  return slug;
};

export const handleDuplicateSlug = (error, res) =>
  error.code === 11000
    ? res.status(409).json({
        success: false,
        message: "A record with this slug already exists",
      })
    : res.status(500).json({
        success: false,
        message: "Failed to create record",
      });
