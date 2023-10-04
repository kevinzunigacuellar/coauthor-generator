import { createStore } from "solid-js/store";

interface Store {
  participants: Participants;
}

type Participants = {
  login: string;
  id: string;
  name: string | null;
  avatarUrl: string;
}[];

const [store, setStore] = createStore<Store>({
  participants: [],
});

export { store, setStore };
