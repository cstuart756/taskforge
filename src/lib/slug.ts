/**
 * Generate a URL-friendly slug from a string.
 *
 * Example: "Stuart's Team" -> "stuarts-team"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    // Replace common accented characters
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // Replace apostrophes and quotes
    .replace(/['"`]/g, "")
    // Replace any non-alphanumeric character with a hyphen
    .replace(/[^a-z0-9]+/g, "-")
    // Collapse multiple hyphens into one
    .replace(/-+/g, "-")
    // Trim leading/trailing hyphens
    .replace(/^-+|-+$/g, "");
}

/**
 * Generate a unique slug by appending a number if necessary.
 *
 * The caller provides a function that checks whether a slug already exists.
 * Example usage with Prisma:
 *
 *   const slug = await uniqueSlug("Stuart's Team", async (candidate) => {
 *     const found = await db.team.findUnique({ where: { slug: candidate } });
 *     return found !== null;
 *   });
 */
export async function uniqueSlug(
  input: string,
  exists: (candidate: string) => Promise<boolean>
): Promise<string> {
  const base = slugify(input) || "team";
  let candidate = base;
  let counter = 1;

  while (await exists(candidate)) {
    counter += 1;
    candidate = `${base}-${counter}`;

    // Safety: prevent infinite loops on pathological inputs
    if (counter > 1000) {
      candidate = `${base}-${Date.now()}`;
      break;
    }
  }

  return candidate;
}