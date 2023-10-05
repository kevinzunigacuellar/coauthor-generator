import { getParticipants } from "../scripts/utils";
import { setStore } from "~/scripts/store";
import { batch } from "solid-js";

export function Search() {
  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    let url = formData.get("url")?.toString() || "";

    const regexPattern =
      /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/pull\/\d+$/;

    if (!regexPattern.test(url)) {
      batch(() => {
        setStore("errors", [
          "Invalid GitHub Pull Request URL try 'https://github.com/<owner>/<repo>/pull/<pr>'",
        ]);
        setStore("participants", []);
      });
      return;
    }

    const urlInfo = new URL(url);
    const [owner, repo, _type, pr] = urlInfo.pathname
      .split("/")
      .filter(Boolean);

    try {
      const participants = await getParticipants({ owner, repo, pr });
      batch(() => {
        setStore("participants", participants);
        setStore("errors", []);
      });
    } catch (e) {
      if (e instanceof Error) {
        const errors = JSON.parse(e.message);
        batch(() => {
          setStore("errors", errors);
          setStore("participants", []);
        });
      }
    }
  }

  return (
    <form class="block w-full relative" onsubmit={handleSubmit}>
      <label for="url" class="block mb-2 font-semibold">
        GitHub Pull Request
      </label>
      <input
        id="url"
        name="url"
        type="url"
        class="block w-full px-3 py-1.5 rounded-md border"
        placeholder="https://github.com/withastro/starlight/pull/742"
        required
      ></input>
      <button
        class="absolute bottom-0.5 right-0.5 border-transparent rounded border block bg-gray-800 hover:bg-gray-700 text-gray-100 px-3 py-1"
        type="submit"
      >
        Generate
      </button>
    </form>
  );
}
