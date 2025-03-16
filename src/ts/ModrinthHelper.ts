import EleventyFetch from "@11ty/eleventy-fetch";
const MODRINTH_PROJECT_API = "https://api.modrinth.com/v2/project/";
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

export async function getMRProject(projectName: string): Promise<Mod> {
  let data = await EleventyFetch(`${MODRINTH_PROJECT_API}${projectName}`, {
    duration: "1h",
    type: "json",
    fetchOptions: {
      headers: {
        "user-agent": "Github/ModGardenEvent/website",
      },
    },
  });
  return data as Mod;
}
export async function getModrinthUser(username: string): Promise<ModrinthUser> {
  let data = await EleventyFetch(`${MODRINTH_USER_API}${username}`, {
    duration: "1h",
    type: "json",
    fetchOptions: {
      headers: {
        "user-agent": "Github/ModGardenEvent/website",
      },
    },
  });
  return data as ModrinthUser;
}

export function getFeaturedImage(mod: Mod): GalleryImage | undefined {
  return mod.gallery.find((image) => image.featured);
}
