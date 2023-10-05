import { Octokit } from "https://esm.sh/octokit?dts";

export default async (req) => {
  const url = new URL(req.url);
  const owner = url.searchParams.get("owner");
  const repo = url.searchParams.get("repo");
  const pr = Number(url.searchParams.get("pr"));

  if (!owner || !repo || !pr) {
    const errors = [
      "Invalid GitHub URL try 'https://github.com/<owner>/<repo>/pull/<pr>'",
    ];
    return new Response(JSON.stringify(errors), {
      status: 400,
    });
  }

  const octokit = new Octokit({ auth: Netlify.env.get("GH_TOKEN") });
  try {
    const data = await octokit.graphql(
      `
      query participants($owner: String!, $repo: String!, $pr: Int!, $first: Int = 100) {
        repository(owner: $owner, name: $repo) {
          pullRequest(number: $pr) {
            participants(first: $first) {
              nodes {
                name,
                login,
                databaseId,
                avatarUrl,
              }
            }
          }
        }
      }
      `,
      {
        owner,
        repo,
        pr,
      },
    );
    const participants = data.repository.pullRequest.participants.nodes.map(
      ({ name, login, databaseId, avatarUrl }) => ({
        name,
        login,
        id: databaseId,
        avatarUrl,
      }),
    );

    return new Response(JSON.stringify(participants));
  } catch (error) {
    const errors = error.errors.map(({ message }) => message);
    return new Response(JSON.stringify(errors), { status: 500 });
  }
};

export const config = { path: "/api/participants" };
