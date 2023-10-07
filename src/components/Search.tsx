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
      <label
        for="url"
        class="block mb-2 text-sm font-mono font-bold tracking-wide text-zinc-900 dark:text-zinc-100"
      >
        GitHub Pull Request
      </label>
      <input
        id="url"
        name="url"
        type="url"
        class="block w-full px-3 py-1.5 rounded-md border placeholder:dark:text-zinc-500 placeholder:text-zinc-400 font-mono dark:text-zinc-300 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:bg-zinc-900 focus:bg-white focus:ring-opacity-60"
        placeholder="https://github.com/withastro/starlight/pull/742"
        required
      ></input>
    </form>
  );
}
