import { setSearch } from "~/scripts/store";

export function Search() {
  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    let url = formData.get("url")?.toString() || "";

    if (!url) return;
    const urlInfo = new URL(url);
    const [owner, repo, type, pr] = urlInfo.pathname.split("/").filter(Boolean);

    if (type !== "pull") return;
    setSearch({ owner, repo, pr });
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
