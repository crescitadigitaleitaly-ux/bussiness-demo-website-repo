import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import catchJson from "@/content/cms/catch.json";
import menuJson from "@/content/cms/menu.json";
import hoursJson from "@/content/cms/hours.json";
import homeJson from "@/content/cms/home.json";
import type { ContentKey } from "./schema";

/**
 * Where admin saves go.
 *
 * - "file" (default in development): writes src/content/cms/<key>.json directly. The site shows the change on the next refresh.
 * - "github" (production): commits the JSON file to the repo through the GitHub API, and Vercel redeploys the site (about 1–2 min).
 *     CMS_GITHUB_TOKEN   fine-grained token with "Contents: read and write" on this repo only
 *     CMS_GITHUB_REPO    owner/repo
 *     CMS_GITHUB_BRANCH  main
 *     CMS_GITHUB_DIR     04-restaurant/src/content/cms
 *
 * File names come from a fixed list, never from user input.
 */

const FILES: Record<ContentKey, string> = { catch: "catch.json", menu: "menu.json", hours: "hours.json", home: "home.json" };
const BUNDLED: Record<ContentKey, unknown> = { catch: catchJson, menu: menuJson, hours: hoursJson, home: homeJson };

export function storageMode(): "file" | "github" | "off" {
  const mode = process.env.CMS_STORAGE ?? (process.env.NODE_ENV === "production" ? "off" : "file");
  return mode === "file" || mode === "github" ? mode : "off";
}

const localPath = (key: ContentKey) => path.join(process.cwd(), "src", "content", "cms", FILES[key]);

function github() {
  const token = process.env.CMS_GITHUB_TOKEN, repo = process.env.CMS_GITHUB_REPO;
  const branch = process.env.CMS_GITHUB_BRANCH ?? "main", dir = process.env.CMS_GITHUB_DIR ?? "04-restaurant/src/content/cms";
  if (!token || !repo || !/^[\w.-]+\/[\w.-]+$/.test(repo)) throw new Error("GitHub saving is not configured.");
  const url = (key: ContentKey) => `https://api.github.com/repos/${repo}/contents/${dir}/${FILES[key]}`;
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  return { url, headers, branch };
}

async function githubGet(key: ContentKey) {
  const g = github();
  const res = await fetch(`${g.url(key)}?ref=${encodeURIComponent(g.branch)}`, { headers: g.headers, cache: "no-store" });
  if (!res.ok) throw new Error(`GitHub read failed (${res.status}).`);
  const body = (await res.json()) as { sha: string; content: string };
  return { sha: body.sha, data: JSON.parse(Buffer.from(body.content, "base64").toString("utf8")) as unknown };
}

/** Latest saved content for the editor (falls back to what was bundled at build time). */
export async function readContent(key: ContentKey): Promise<unknown> {
  try {
    if (storageMode() === "file") return JSON.parse(await readFile(localPath(key), "utf8"));
    if (storageMode() === "github") return (await githubGet(key)).data;
  } catch {
    // fall through to the bundled copy
  }
  return BUNDLED[key];
}

export async function writeContent(key: ContentKey, data: unknown) {
  const json = JSON.stringify(data, null, 2) + "\n";
  const mode = storageMode();
  if (mode === "file") return writeFile(localPath(key), json, "utf8");
  if (mode === "github") {
    const g = github();
    const { sha } = await githubGet(key);
    const res = await fetch(g.url(key), {
      method: "PUT",
      headers: g.headers,
      body: JSON.stringify({ message: `content: update ${key} from the admin panel`, content: Buffer.from(json).toString("base64"), sha, branch: g.branch }),
    });
    if (!res.ok) throw new Error(`GitHub save failed (${res.status}).`);
    return;
  }
  throw new Error("Saving is switched off on this server.");
}
