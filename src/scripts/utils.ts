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
  if (!res.ok) {
    throw new Error(await res.text());
  }

  const participants = await res.json();

  return participants;
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
