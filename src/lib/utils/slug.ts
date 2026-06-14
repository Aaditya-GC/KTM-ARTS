export function generateSlug(title: string, existingSlugs: string[] = []): string {
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  if (existingSlugs.includes(slug)) {
    let counter = 2;
    while (existingSlugs.includes(`${slug}-${counter}`)) counter++;
    slug = `${slug}-${counter}`;
  }

  return slug;
}
