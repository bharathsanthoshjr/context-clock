// Context Clock — ChatGPT adapter
// Everything specific to ChatGPT's page lives here.
// If ChatGPT changes its page, this is the only file that should need editing.

const CONTEXT_CLOCK_PLATFORM = {
  id: "chatgpt",
  name: "ChatGPT",

  // Tried in order; the first one found on the page is used.
  // Verified by inspecting chatgpt.com on 23 Oct 2026.
  composerSelectors: [
    'div.ProseMirror[contenteditable="true"][data-composer-markdown]',
    "#prompt-textarea",
    'div.ProseMirror[contenteditable="true"]',
  ],
};