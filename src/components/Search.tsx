import { getParticipants } from "../scripts/utils";
import { setStore } from "~/scripts/store";

export function Search() {
  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    let url = formData.get("url")?.toString();

    // TODO: validation
    if (!url) {
      return;
    }

    const urlInfo = new URL(url);
    const [owner, repo, _type, pr] = urlInfo.pathname
      .split("/")
      .filter(Boolean);

    const participants = await getParticipants({ owner, repo, pr });
    setStore("participants", participants);
  }

  return (
    <form class="block w-full" onsubmit={handleSubmit}>
      <label for="url" class="block mb-2 font-semibold">
        GitHub Pull Request
      </label>
      <input
        id="url"
        name="url"
        type="url"
        class="w-full px-3 py-1.5 rounded-md border"
        placeholder="https://github.com/withastro/starlight/pull/742"
        required
      />
    </form>
  );
}
