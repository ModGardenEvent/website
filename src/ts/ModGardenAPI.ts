import { getModrinthProject, getModrinthProjects, type Mod } from "./ModrinthHelper.ts";

export type ResponseErrorData = {
  error: string;
  description: string;
};

export class ResponseError extends Error {
  constructor(data: ResponseErrorData) {
    super(`HTTP '${data.error}': ${data.description}`)
  }
}

export class EndpointError extends Error {
  constructor(message: string) {
    super(`HTTP Endpoint error: ${message}`)
  }
}

function extractData<T>(data: any): T {
  if (data.error && data.description) {
    throw new ResponseError(data as ResponseErrorData);
  }

  return data as T
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.headers.has("Content-Type") && response.headers.get("Content-Type") === "text/plain") {
    throw new EndpointError(await response.text());
  } else {
    return response.json();
  }
}

export type UserData = {
  id: string;
  username: string;
  bio: {
    display_name?: string;
    pronouns?: string;
    avatar_url?: string;
  };
  integrations: {
    discord?: {
      user_id?: string;
    }
    modrinth?: {
      user_id?: string;
    }
  };
  created: string;
  projects: string[];
  events: string[];
  roles: string[];
};

export type EventSubmission = {
  id: string;
  project: Project;
  event_id: string;
  platform: {
    type: "modrinth";
    project_id: string;
    version_id: string;
  } | {
    type: "download_url";
    download_url: string;
  };
  time_submitted: string;
};

export type Project = {
  id: string;
  metadata: {
    type: string;
    mod_id?: string;
    name?: string;
    description?: string;
    source_url?: string;
  };
  team: { [user_id: string]: string };
  permissions: { [user_id: string]: string };
  submissions: string[];
};

export type ModGardenGenre = {
  id: string;
  slug: string;
  metadata: {
    name?: string;
    description?: string;
  };
  events: string[];
};
export type ModGardenEvent = {
  id: string;
  slug: string;
  metadata: {
    name?: string;
  };
  platform: {
    game: "minecraft";
    game_version: string;
    mod_loader: "fabric" | "cichlid";
  };
  roles: { [key: string]: string };
  times: { [key: string]: string };
};

export type ByQuery = "id" | "slug" | "mod_id" | "username" | undefined;
export type Query = [string, string];

function query(...queries: (Query | undefined)[]): string {
  let str = "";
  for (const [key, value] of queries.filter((query) => query) as Query[]) {
    str += (str.length === 0) ? "?" : "&";
    str += `${key}=${value}`;
  }
  return str;
}

function byQuery(by: ByQuery): Query | undefined {
  return by ? ["by", by] : undefined;
}

const api_url =
  process.argv.includes("--api") &&
  process.argv[process.argv.indexOf("--api") + 1] === "local"
    ? "http://localhost:7070/v2/"
    : "https://api.modgarden.net/v2/";

export async function getUserData(
  id: string,
  by: ByQuery = "username"
): Promise<UserData> {
  return fetch(api_url + "users/" + id + query(byQuery(by)))
    .then((response) => handleResponse(response))
    .then((data) => extractData(data));
}

export async function getGenres(): Promise<ModGardenGenre[]> {
  return fetch(api_url + "genres")
    .then((response) => handleResponse(response))
    .then((data) => extractData(data));
}

export async function getEvent(
  genre_id: string,
  event_id: string,
  by: ByQuery = undefined
): Promise<ModGardenEvent> {
  return fetch(api_url + "events/" + genre_id + "/" + event_id + query(byQuery(by)))
    .then((response) => handleResponse(response))
    .then((data) => extractData(data));
}

export async function getEvents(): Promise<ModGardenEvent[]> {
  return getGenres()
    .then((genres) => {
      let eventsPromises: Promise<ModGardenEvent>[] = [];
      // TODO: display events in different genres seperately
      genres.forEach((genre) => {
        genre.events.forEach((event_id) => {
          eventsPromises.push(getEvent(genre.id, event_id, "id"))
        });
      });
      eventsPromises.reverse(); // sort by most recent
      return Promise.all(eventsPromises);
    });
}

export async function getSubmission(
  id: string,
  by: ByQuery = undefined,
): Promise<EventSubmission> {
  return fetch(api_url + "submissions/" + id + query(byQuery(by)))
    .then((response) => handleResponse(response))
    .then((data) => extractData(data));
}

export async function getProject(id: string): Promise<Project> {
  return fetch(api_url + "projects/" + id)
    .then((response) => handleResponse(response))
    .then((data) => extractData(data));
}

export async function getUserProjects(user: string): Promise<Project[]> {
  return fetch(api_url + "users/" + user)
    .then((response) => handleResponse(response))
    .then((data) => extractData<UserData>(data).projects)
    .then((projects) => Promise.all(projects.map(getProject)));
}
export async function getUserSubmissions(
  user: string,
): Promise<EventSubmission[]> {
  return getUserProjects(user)
    .then((projects) => {
      let submissionPromises: Promise<EventSubmission>[] = [];
      projects.forEach((project) => {
        if (project.metadata.type == "mod") {
          submissionPromises.push(getSubmission(project.metadata.mod_id!, "mod_id"));
        }
      });
      return Promise.all(submissionPromises);
    });
}

export async function getEventProjects(event: string): Promise<Project[]> {
  return fetch(api_url + "events/" + event + "/submissions")
    .then((response) => handleResponse(response))
    .then((data) => extractData(data))
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
  genre_id: string,
  event_id: string,
  by: ByQuery = undefined
): Promise<EventSubmission[]> {
  return fetch(api_url + "events/" + genre_id + "/" + event_id + "/submissions" + query(byQuery(by)))
    .then((response) => handleResponse(response))
    .then((data) => extractData(data));
}

export async function getModrinthModData(
  modrinth_id: string,
): Promise<Mod | undefined> {
  return await getModrinthProject(modrinth_id);
}

export async function getModrinthModDataForEvent(genre_id: string, event_id: string, by: ByQuery = undefined): Promise<Mod[]> {
    const platforms = (await getEventSubmissions(genre_id, event_id, by))
      .map((value) => value.platform)
      .filter((value) => value.type === "modrinth");
    return await getModrinthProjects(platforms.map((submission) => submission.project_id));
}

export type SubmissionAndMod = {
    submission: EventSubmission;
    mod: Mod;
}

export async function getSubmissions(genre_id: string, event_id: string, by: ByQuery = undefined) : Promise<SubmissionAndMod[]> {
  const modrinthProjects = await getModrinthModDataForEvent(genre_id, event_id, by);
  const unsortedSubmissions = await getEventSubmissions(genre_id, event_id, by);
  const submissions = new Array<SubmissionAndMod>(unsortedSubmissions.length);
  for (let i = 0; i < unsortedSubmissions.length; ++i) {
    const submission = unsortedSubmissions[i];
    const mod = modrinthProjects.find(mod => mod.id === (submission.platform.type === "modrinth" ? submission.platform.project_id : undefined));
    submissions[i] = { submission: submission, mod: mod } as SubmissionAndMod;
  }
  submissions.sort((a, b) => a.mod.title.localeCompare(b.mod.title))
  return submissions;
}
