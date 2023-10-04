import { For, Show, createSignal } from "solid-js";
import { store } from "~/scripts/store";
import { createCoauthorString } from "~/scripts/utils";

export function Clipboard() {
  return (
    <div class="relative group bg-white border border-gray-200 p-4 w-full max-w-2xl mt-6 font-mono rounded-md">
      <Show
        when={store.participants.length > 0}
        fallback="Enter a GitHub pull request url to get started"
      >
        <CopyButton />
        <ul>
          <For each={store.participants}>
            {(participant) => (
              <li>
                {createCoauthorString({
                  login: participant.login,
                  id: participant.id,
                  name: participant.name,
                })}
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
}

function CopyButton() {
  const [copied, setCopied] = createSignal(false);

  function clickHandler() {
    const copyText = store.participants.map(createCoauthorString).join("\n");

    navigator.clipboard.writeText(copyText).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 800);
    });
  }

  return (
    <button
      class="absolute bg-white opacity-0 group-hover:opacity-100 hover:bg-gray-100 z-20 right-2 top-2 border border-gray-300 p-1 rounded-md"
      classList={{
        "text-green-600 border-green-600": copied(),
        "text-gray-500": !copied(),
      }}
      onclick={clickHandler}
    >
      <Show when={copied()} fallback={<CopyIcon />}>
        <CheckIcon />
      </Show>
    </button>
  );
}

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}
