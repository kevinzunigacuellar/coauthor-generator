import { createStore } from "solid-js/store";

interface Store {
  participants: Participants;
  errors: string[];
}

type Participants = {
  login: string;
  id: string;
  name: string | null;
  avatarUrl: string;
}[];

const [store, setStore] = createStore<Store>({
  participants: [],
  errors: [],
});

export { store, setStore };
