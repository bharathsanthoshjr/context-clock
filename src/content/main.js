// Context Clock content script — Stage 6, Part D1
// 1. Typing or pasting into an empty message box automatically adds the context line.
// 2. Alt+T inserts or refreshes the context line at any time.
// Uses: buildTimeContext and CONTEXT_PREFIX (time-context.js),
//       CONTEXT_CLOCK_PLATFORM (platforms/*.js),
//       findComposer and insertContext (composer.js).

const LOG_PREFIX = "[ContextClock]";

// True while our own code is inserting text, so we ignore our own typing events.
let isInsertingContext = false;

// Inserts or refreshes the context line, and logs what happened.
// "source" is just a label for the log: "typing", "paste" or "shortcut".
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

// Waits for the user's text to land, then adds the context line in front of it.
function scheduleAutoInsert(composer, source) {
  setTimeout(() => {
    if (!composer.isConnected) {
      return;
    }
    const text = composer.textContent;
    if (text.trim() === "" || text.startsWith(CONTEXT_PREFIX)) {
      return;
    }
    runInsertion(composer, source);
  }, 0);
}

// Typing: the browser fires "beforeinput" just before the text changes.
function handleBeforeInput(event) {
  if (isInsertingContext) {
    return; // This is our own insertion; ignore it.
  }
  if (!event.inputType.startsWith("insert") || event.isComposing) {
    return; // Only react to new text, and never during IME composition.
  }

  const composer = getComposerForEvent(event);
  if (!composer || composer.textContent.trim() !== "") {
    return; // Not the message box, or it already has text.
  }

  scheduleAutoInsert(composer, "typing");
}

// Pasting: the editor handles pastes itself, so "beforeinput" never fires.
// The "paste" event still fires first, so we listen for that too.
function handlePaste(event) {
  if (isInsertingContext) {
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
    if (isContextShortcut(event)) {
      event.preventDefault();
      handleShortcut();
    }
  },
  true
);

console.log(
  LOG_PREFIX,
  `Loaded on ${CONTEXT_CLOCK_PLATFORM.name}. Start typing to add the time automatically, or press Alt+T.`
);