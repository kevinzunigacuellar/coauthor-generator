interface Participants {
  name: string;
  login: string;
  id: string;
}
export async function getParticipants({
  owner,
  repo,
  pr,
}: {
  owner: string;
  repo: string;
  pr: string;
}) {
  if (!owner || !repo || !pr) {
    return;
  }

  const urlParams = new URLSearchParams({
    owner,
    repo,
    pr,
  }).toString();

  const res = await fetch(`/api/participants?${urlParams}`);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data as Participants[];
}

export function createCoauthorString(user: {
  login: string;
  id: string;
  name: string | null;
}) {
  return `Co-authored-by: ${user.name ?? user.login} <${user.id}+${
    user.login
  }@users.noreply.github.com>`;
}
