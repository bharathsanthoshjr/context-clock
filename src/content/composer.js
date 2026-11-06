// Context Clock — composer helpers
// Finds the message box and inserts or refreshes the context line.
// Works on the unsent draft only; never touches sent messages.

// True if the element is in the page and takes up space on screen.
function isVisible(element) {
  return element.isConnected && element.getClientRects().length > 0;
}

// Finds the message box the user is working in.
// Sites like ChatGPT can keep old, hidden message boxes in the page after navigation,
// so we prefer the focused box, then the first visible one.
function findComposer(selectors) {
  const focusedElement = document.activeElement;

  for (const selector of selectors) {
    const matches = Array.from(document.querySelectorAll(selector));

    const focused = matches.find(
      (element) => element === focusedElement || element.contains(focusedElement)
    );
    if (focused) {
      return focused;
    }

    const visible = matches.find(isVisible);
    if (visible) {
      return visible;
    }
  }
  return null;
}

// Returns the first piece of text inside the composer, or null if it's empty.
function getFirstTextNode(composer) {
  const walker = document.createTreeWalker(composer, NodeFilter.SHOW_TEXT);
  return walker.nextNode();
}

// Puts the cursor at a specific place in the composer.
function setSelection(range) {
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

// If the draft already starts with a context line, selects it (plus the space after it)
// so that typing replaces it. Returns true if one was found.
function selectExistingContext(composer) {
  const firstText = getFirstTextNode(composer);
  if (!firstText || !firstText.textContent.startsWith(CONTEXT_PREFIX)) {
    return false;
  }

  const text = firstText.textContent;
  const closingBracket = text.indexOf("]");
  if (closingBracket === -1) {
    return false;
  }

  let endOffset = closingBracket + 1;
  if (endOffset < text.length && /\s/.test(text[endOffset])) {
    endOffset += 1;
  }

  const range = document.createRange();
  range.setStart(firstText, 0);
  range.setEnd(firstText, endOffset);
  setSelection(range);
  return true;
}

// Places the cursor at the very start of the draft.
function placeCursorAtStart(composer) {
  const target = getFirstTextNode(composer) || composer.querySelector("p") || composer;
  const range = document.createRange();
  range.setStart(target, 0);
  range.collapse(true);
  setSelection(range);
}

// Places the cursor at the very end of the draft, so the user can keep typing.
function placeCursorAtEnd(composer) {
  const range = document.createRange();
  range.selectNodeContents(composer);
  range.collapse(false);
  setSelection(range);
}

// Inserts a fresh context line at the start of the draft,
// or replaces the existing one so there is never more than one.
function insertContext(composer) {
  composer.focus();

  const replaced = selectExistingContext(composer);
  if (!replaced) {
    placeCursorAtStart(composer);
  }

  const contextLine = buildTimeContext() + " ";
  document.execCommand("insertText", false, contextLine);

  placeCursorAtEnd(composer);

  const succeeded = composer.textContent.startsWith(CONTEXT_PREFIX);
  return { succeeded, replaced };
}