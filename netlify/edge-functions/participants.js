import { Octokit } from "https://esm.sh/octokit?dts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GQL_QUERY = `
query participants($owner: String!, $repo: String!, $pr: Int!, $first: Int = 100) {
  repository(owner: $owner, name: $repo) {
    pullRequest(number: $pr) {
      author {
        login
      }
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
`;

async function storeAnalytics(owner, repo) {
  const supabase = createClient(
    Netlify.env.get("SB_URL"),
    Netlify.env.get("SB_ANON_KEY"),
  );

  const { data, error } = await supabase
    .from("analytics")
    .select("id, count")
    .eq("owner", owner)
    .eq("repo", repo)
    .limit(1);

  if (error) return;

  if (data.length > 0) {
    const { id, count } = data[0];
    await supabase
      .from("analytics")
      .update({ count: count + 1 })
      .eq("id", id);
  } else {
    await supabase.from("analytics").insert({ owner, repo });
  }
}

async function getParticipants(owner, repo, pr) {
  const octokit = new Octokit({ auth: Netlify.env.get("GH_TOKEN") });
  try {
    const data = await octokit.graphql(GQL_QUERY, {
      owner,
      repo,
      pr,
    });
    const authorLogin = data.repository.pullRequest.author.login;
    const participants = data.repository.pullRequest.participants.nodes
      .map(({ name, login, databaseId, avatarUrl }) => ({
        name,
        login,
        id: databaseId,
        avatarUrl,
      }))
      .filter((p) => p.login !== authorLogin);
    storeAnalytics(owner, repo);
    return {
      error: null,
      participants,
    };
  } catch (error) {
    const [message] = error.errors.map(({ message }) => message);
    return {
      error: {
        message,
      },
      participants: [],
    };
  }
}

export default async (req) => {
  const url = new URL(req.url);
  const owner = url.searchParams.get("owner");
  const repo = url.searchParams.get("repo");
  const pr = Number(url.searchParams.get("pr"));

  if (!owner || !repo || !pr) {
    return new Response(
      JSON.stringify({
        message: "Invalid GitHub URL",
      }),
      {
        status: 500,
      },
    );
  }

  const { error, participants } = await getParticipants(owner, repo, pr);
  
  if (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(participants), {
    headers: {
      "content-type": "application/json",
    },
  });
};

export const config = { path: "/api/participants" };
