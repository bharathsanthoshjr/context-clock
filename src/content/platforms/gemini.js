// Context Clock — Gemini adapter
// Everything specific to Gemini's page lives here.
// If Gemini changes its page, this is the only file that should need editing.

const CONTEXT_CLOCK_PLATFORM = {
  id: "gemini",
  name: "Gemini",

  // Tried in order; the first one found on the page is used.
  // Gemini uses the Quill editor. Every selector requires the "ql-editor" class,
  // so Quill's hidden "ql-clipboard" helper box is never matched.
  // Verified by inspecting gemini.google.com on 6 Nov 2026.
  composerSelectors: [
    'rich-textarea div.ql-editor[contenteditable="true"]',
    'div.ql-editor[contenteditable="true"][role="textbox"]',
    'div.ql-editor[contenteditable="true"]',
  ],
};