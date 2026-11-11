// Context Clock content script — Stage 10
// 1. Typing or pasting into an empty message box automatically adds the context line.
// 2. Alt+T inserts or refreshes the context line at any time.
// 3. Both only work when the extension and this site are switched on in the popup.
// 4. If settings can't be read, the extension stays off on this page (fail-safe).
// Uses: buildTimeContext and CONTEXT_PREFIX (time-context.js),
//       loadSettings and isPlatformActive (settings.js),
//       CONTEXT_CLOCK_PLATFORM (platforms/*.js),
//       findComposer and insertContext (composer.js).

const LOG_PREFIX = "[ContextClock]";

// ---------- Settings ----------

// null until loaded. Until then, the extension does nothing (fail-safe).
let currentSettings = null;

function isActiveHere() {
  return isPlatformActive(currentSettings, CONTEXT_CLOCK_PLATFORM.id);
}

function logActiveState() {
  const state = isActiveHere() ? "ON" : "OFF";
  console.log(LOG_PREFIX, `${CONTEXT_CLOCK_PLATFORM.name}: ${state}`);
}

loadSettings()
  .then((settings) => {
    currentSettings = settings;
    logActiveState();
  })
  .catch((error) => {
    // Settings stay null, so the extension stays off on this page (fail-safe).
    console.warn(LOG_PREFIX, "Could not read settings; staying off on this page.", error);
  });

// When the popup saves a change, update immediately (no reload needed).
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local" || currentSettings === null) {
    return;
  }
  for (const key in changes) {
    currentSettings[key] = changes[key].newValue;
  }
  logActiveState();
});

// ---------- Insertion ----------

// True while our own code is inserting text, so we ignore our own typing events.
let isInsertingContext = false;

// Inserts or refreshes the context line, and logs what happened.
function runInsertion(composer, source) {
  isInsertingContext = true;
  try {
    const { succeeded, replaced } = insertContext(composer);
    if (succeeded) {
      const action = replaced ? "refreshed" : "inserted";
      console.log(LOG_PREFIX, `Context line ${action} (${source}).`);
    } else {
      console.warn(LOG_PREFIX, `Insertion may have failed (${source}); check the message box.`);
    }
  } finally {
    isInsertingContext = false;
  }
}

// Returns the message box an event happened in, or null if it wasn't the chat message box.
function getComposerForEvent(event) {
  if (!(event.target instanceof Element)) {
    return null;
  }
  const editor = event.target.closest('[contenteditable="true"]');
  if (!editor) {
    return null;
  }
  const isChatComposer = CONTEXT_CLOCK_PLATFORM.composerSelectors.some((selector) =>
    editor.matches(selector)
  );
  return isChatComposer ? editor : null;
}

// ---------- Automatic mode ----------

function scheduleAutoInsert(composer, source) {
  setTimeout(() => {
    if (!isActiveHere() || !composer.isConnected) {
      return;
    }
    const text = composer.textContent;
    if (text.trim() === "" || text.startsWith(CONTEXT_PREFIX)) {
      return;
    }
    runInsertion(composer, source);
  }, 0);
}

function handleBeforeInput(event) {
  if (isInsertingContext || !isActiveHere()) {
    return;
  }
  if (!event.inputType.startsWith("insert") || event.isComposing) {
    return;
  }
  const composer = getComposerForEvent(event);
  if (!composer || composer.textContent.trim() !== "") {
    return;
  }
  scheduleAutoInsert(composer, "typing");
}

function handlePaste(event) {
  if (isInsertingContext || !isActiveHere()) {
    return;
  }
  const composer = getComposerForEvent(event);
  if (!composer || composer.textContent.trim() !== "") {
    return;
  }
  scheduleAutoInsert(composer, "paste");
}

document.addEventListener("beforeinput", handleBeforeInput, true);
document.addEventListener("paste", handlePaste, true);

// ---------- Manual shortcut: Alt+T ----------

function handleShortcut() {
  const composer = findComposer(CONTEXT_CLOCK_PLATFORM.composerSelectors);
  if (!composer) {
    console.warn(LOG_PREFIX, `Message box not found on ${CONTEXT_CLOCK_PLATFORM.name}.`);
    return;
  }
  runInsertion(composer, "shortcut");
}

function isContextShortcut(event) {
  return event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.code === "KeyT";
}

document.addEventListener(
  "keydown",
  (event) => {
    if (isContextShortcut(event) && isActiveHere()) {
      event.preventDefault();
      handleShortcut();
    }
  },
  true
);

console.log(LOG_PREFIX, `Loaded on ${CONTEXT_CLOCK_PLATFORM.name}.`);