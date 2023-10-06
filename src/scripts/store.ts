import { createSignal } from "solid-js";

export const [search, setSearch] = createSignal({
  owner: "",
  repo: "",
  pr: "",
});
