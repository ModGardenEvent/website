import EleventyFetch from "@11ty/eleventy-fetch";
import { LIB_VERSION } from "./Version";
const MODRINTH_PROJECT_API = "https://api.modrinth.com/v2/project/";
const MODRINTH_PROJECTS_API = "https://api.modrinth.com/v2/projects?ids=";
const MODRINTH_USER_API = "https://api.modrinth.com/v2/user/";
export interface GalleryImage {
  url: string;
  featured: boolean;
  description?: string;
  ordering: number;
}
export interface Mod {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  icon_url: string;
  gallery: GalleryImage[];
}
export interface ModrinthUser {
  id: string;
  username: string;
  avatar_url: string;
}

export interface File {
  filename: string;
}

export async function getModrinthProject(projectName: string): Promise<Mod> {
  let data = await EleventyFetch(`${MODRINTH_PROJECT_API}[${projectName}]`, {
    duration: "1h",
    type: "json",
    fetchOptions: {
      headers: {
        "User-Agent": `ModGardenEvent/website/${LIB_VERSION} (modgarden.net)`,
      },
    },
  });
  return data as Mod;
}

export async function getModrinthProjects(projectNames: string[]): Promise<Mod[]> {
  let data = await EleventyFetch(`${MODRINTH_PROJECTS_API}[${projectNames.map(projectName => "\"" + projectName + "\"").join(",")}]`, {
    duration: "1h",
    type: "json",
    fetchOptions: {
      headers: {
        "User-Agent": `ModGardenEvent/website/${LIB_VERSION} (modgarden.net)`,
      },
    },
  });
  return data as Mod[];
}

export async function getModrinthUser(username: string): Promise<ModrinthUser> {
  let data = await EleventyFetch(`${MODRINTH_USER_API}${username}`, {
    duration: "1h",
    type: "json",
    fetchOptions: {
      headers: {
        "User-Agent": `ModGardenEvent/website/${LIB_VERSION} (modgarden.net)`,
      },
    },
  });
  return data as ModrinthUser;
}

export function getFeaturedImage(mod: Mod): GalleryImage | undefined {
  return mod.gallery.find((image) => image.featured);
}
