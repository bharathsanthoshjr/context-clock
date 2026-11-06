// Context Clock — Claude adapter
// Everything specific to Claude's page lives here.
// If Claude changes its page, this is the only file that should need editing.

const CONTEXT_CLOCK_PLATFORM = {
  id: "claude",
  name: "Claude",

  // Tried in order; the first one found on the page is used.
  // Verified by inspecting claude.ai on 6 Nov 2026.
  composerSelectors: [
    'div[contenteditable="true"][data-testid="chat-input"]',
    'div.ProseMirror[contenteditable="true"][data-composer-editor]',
    'div.ProseMirror[contenteditable="true"]',
  ],
};