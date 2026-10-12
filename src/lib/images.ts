import fs from "node:fs";
import path from "node:path";

const publicDir = path.join(process.cwd(), "public");
const exts = ["jpg", "jpeg", "png", "webp"];

function find(rel: string): string | null {
  for (const ext of exts) {
    const candidate = `${rel}.${ext}`;
    try {
      if (fs.existsSync(path.join(publicDir, candidate))) return `/${candidate}`;
    } catch {
      /* ignore */
    }
  }
  return null;
}

/** Hero background for the home page, if an image has been generated. */
export function heroImage(): string | null {
  return find("images/hero");
}

/** Banner image for an organization, if one has been generated. */
export function orgImage(slug: string): string | null {
  return find(`images/orgs/${slug}`);
}
