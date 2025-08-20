import { getModrinthProject, getModrinthProjects, type Mod } from "./ModrinthHelper.ts";

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
  avatar_url?: string;
  pronouns?: string;
  discord_id: string;
  modrinth_id?: string;
  created: number;
  projects: string[];
  events: string[];
  minecraft_accounts?: String[];
};

export type EventSubmission = {
  id: string;
  project: Project;
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
  builders: string[];
};

export type ModGardenEvent = {
  id: string;
  slug: string;
  display_name: string;
  minecraft_version: string;
  loader: string;
  registration_time: string;
  start_time: string;
  end_time: string;
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
    ? "http://localhost:7070/v1/"
    : "https://api.modgarden.net/v1/";

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
): Promise<ModGardenEvent | ResponseError> {
  return await fetch(api_url + "event/" + slug)
    .then((response) => response.json())
    .then((data) =>
      data.error ? (data as ResponseError) : (data as ModGardenEvent),
    );
}

export async function getEvents(): Promise<ModGardenEvent[]> {
  return await fetch(api_url + "events")
    .then((response) => response.json())
    .then((data) => data as ModGardenEvent[]);
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
  return fetch(api_url + "event/" + event + "/submissions")
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    })
    .then((data) => data as EventSubmission[])
    .then((submissions) => {
        if (!Array.isArray(submissions)) {
          throw new Error("Expected an array of submissions, something went wrong. instead got: " + typeof submissions);
        }
        if (submissions.length === 0) {
          return [];
        }
        return submissions.map((submission) => submission.project);
      }
    );
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
  return await getModrinthProject(modrinth_id);
}

export async function getModrinthModDataForEvent(event: string): Promise<Mod[]> {
    const projects = await getEventProjects(event);
    return await getModrinthProjects(projects.map(project => project.modrinth_id));
}