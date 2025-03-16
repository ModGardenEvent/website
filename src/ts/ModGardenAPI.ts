//
import { getMRProject, type Mod } from "./ModrinthHelper.ts";

export type MinecraftAccount = {
  uuid: string;
  verified: boolean;
};

export type ResponseError = {
  error: string;
  description: string;
};

export type UserData = {
  id: string;
  username: string;
  display_name: string;
  discord_id: string;
  modrinth_id?: string;
  created: number;
  projects: string[];
  events: string[];
  minecraft_accounts?: String[];
};

export type EventSubmission = {
  id: string;
  project_id: string;
  event: string;
  modrinth_version_id: string;
  submitted: number;
};

export type Project = {
  id: string;
  slug: string;
  modrinth_id: string;
  attributed_to: string;
  authors: string[];
};

export type ModGardenEvents = {
  id: string;
  slug: string;
  display_name: string;
  description: string;
  minecraft_version: string;
  loader: string;
  loader_version: string;
  started: number;
};
export type AwardTier = "COMMON" | "UNCOMMON" | "RARE" | "LEGENDARY";
export type Award = {
  award_id: string;
  awarded_to: string;
  custom_data: string;
  slug: string;
  display_name: string;
  sprite: string;
  discord_emote: string;
  tooltip: string;
  submission_id: string;
  tier: AwardTier;
};
export function getNiceTierName(tier: AwardTier): string {
  switch (tier) {
    case "COMMON":
      return "Common";
    case "UNCOMMON":
      return "Uncommon";
    case "RARE":
      return "Rare";
    case "LEGENDARY":
      return "Legendary";
  }
}

const api_url =
  process.argv.includes("--api") &&
  process.argv[process.argv.indexOf("--api") + 1] === "local"
    ? "http://localhost:7070/"
    : "https://api.modgarden.net/";

export async function getUserData(
  username: string,
): Promise<UserData | ResponseError> {
  return await fetch(api_url + "user/" + username)
    .then((response) => response.json())
    .then((data) =>
      data.error ? (data as ResponseError) : (data as UserData),
    );
}

export async function getEvent(
  slug: string,
): Promise<ModGardenEvents | ResponseError> {
  return await fetch(api_url + "event/" + slug)
    .then((response) => response.json())
    .then((data) =>
      data.error ? (data as ResponseError) : (data as ModGardenEvents),
    );
}

export async function getEvents(): Promise<ModGardenEvents[]> {
  return await fetch(api_url + "events")
    .then((response) => response.json())
    .then((data) => data as ModGardenEvents[]);
}

export async function getSubmission(
  id: string,
): Promise<EventSubmission | ResponseError> {
  return fetch(api_url + "submission/" + id)
    .then((response) => response.json())
    .then((data) =>
      data.error ? (data as ResponseError) : (data as EventSubmission),
    );
}

export async function getProject(id: string): Promise<Project | ResponseError> {
  return fetch(api_url + "project/" + id)
    .then((response) => response.json())
    .then((data) => (data.error ? (data as ResponseError) : (data as Project)));
}

export async function getUserProjects(user: string): Promise<Project[]> {
  return fetch(api_url + "user/" + user + "/projects")
    .then((response) => response.json())
    .then((data) => data as Project[]);
}
export async function getUserSubmissions(
  user: string,
): Promise<EventSubmission[]> {
  return fetch(api_url + "user/" + user + "/submissions")
    .then((response) => response.json())
    .then((data) => data as EventSubmission[]);
}

export async function getEventProjects(event: string): Promise<Project[]> {
  return fetch(api_url + "event/" + event + "/projects")
    .then((response) => response.json())
    .then((data) => data as Project[]);
}

export async function getEventSubmissions(
  event: string,
): Promise<EventSubmission[]> {
  return fetch(api_url + "event/" + event + "/submissions")
    .then((response) => response.json())
    .then((data) => data as EventSubmission[]);
}

export async function getUserAwards(user: string): Promise<Award[]> {
  return fetch(api_url + "user/" + user + "/awards")
    .then((response) => response.json())
    .then((data) => data as Award[]);
}

export async function getModrinthModData(
  modrinth_id: string,
): Promise<Mod | undefined> {
  return await getMRProject(modrinth_id);
}
