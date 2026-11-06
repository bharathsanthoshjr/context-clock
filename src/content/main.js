// Context Clock content script — Stage 6, Part C
// Alt+T inserts or refreshes the context line in the unsent draft.
// Uses: buildTimeContext (time-context.js), CONTEXT_CLOCK_PLATFORM (platforms/*.js),
//       findComposer and insertContext (composer.js).

const LOG_PREFIX = "[ContextClock]";

function handleInsertRequest() {
  const composer = findComposer(CONTEXT_CLOCK_PLATFORM.composerSelectors);

  if (!composer) {
    console.warn(LOG_PREFIX, `Message box not found on ${CONTEXT_CLOCK_PLATFORM.name}.`);
    return;
  }

  const { succeeded, replaced } = insertContext(composer);

  if (succeeded) {
    console.log(LOG_PREFIX, replaced ? "Context line refreshed." : "Context line inserted.");
  } else {
    console.warn(LOG_PREFIX, "Insertion may have failed; check the message box.");
  }
}

function isContextShortcut(event) {
  return event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.code === "KeyT";
}

document.addEventListener(
  "keydown",
  (event) => {
    if (isContextShortcut(event)) {
      event.preventDefault();
      handleInsertRequest();
    }
  },
  true
);

console.log(LOG_PREFIX, `Loaded on ${CONTEXT_CLOCK_PLATFORM.name}. Press Alt+T to insert the time.`);