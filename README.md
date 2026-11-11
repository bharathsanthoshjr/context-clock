# Context Clock

A privacy-first Chrome extension that adds your local date, time, and time zone to messages on ChatGPT, Claude, and Gemini.

## The problem

AI chat assistants can't tell how much time has passed between messages. They don't sense time; they read it, and only if it's written into the conversation.

I noticed this while preparing for an interview. ChatGPT said "let's continue tomorrow." A few minutes later I said "good morning," and it carried on as if it were the next day.

## The solution

Context Clock adds a short, visible timestamp to the start of each new message:

`[Sent: Fri 6 Nov 2026, 21:23 (Asia/Calcutta, UTC+05:30)] good morning`

With the timestamp in place, the assistant has the information it needs. In testing, ChatGPT replied: *"It's 9:25 PM already! Still saying good morning?"*

Some AI apps already pass the time to the model behind the scenes, but this varies between apps and isn't visible to the user. Context Clock makes it **visible, consistent across ChatGPT, Claude, and Gemini, and under the user's control**.

## Features

- **Automatic:** typing or pasting into an empty message box adds the timestamp at the start.
- **Manual:** press **Alt+T** to insert the timestamp or refresh it to the current time.
- **Visible and editable:** the timestamp appears before you send, so you can edit or delete it. If you delete it, it stays deleted.
- **Per-site controls:** a master switch plus a switch for each site. Changes apply immediately, without reloading.
- **Private by design:** no servers, no analytics, no data collection. See [PRIVACY.md](PRIVACY.md).

## Status

| Platform | Status |
|---|---|
| ChatGPT | ✅ Working, tested manually |
| Claude | ✅ Working, tested manually |
| Gemini | ✅ Working, tested manually |

The full test record, including bugs found and fixed, is in [TESTING.md](TESTING.md).

## Install

Context Clock is not published on the Chrome Web Store. To install it in developer mode:

1. Download this repository (green **Code** button → **Download ZIP**, then unzip it).
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the project folder.
5. Pin Context Clock from the puzzle-piece menu in the toolbar.

## How it works

The extension is built with Chrome's Manifest V3, using plain HTML, CSS, and JavaScript. There is no build step and there are no third-party dependencies.

**Key design decision:** one shared core, plus a small adapter file per website. Each site's adapter only describes where its message box is. Adding Claude after ChatGPT meant writing one adapter and one configuration entry. Gemini uses a different text editor (Quill instead of ProseMirror), and the same core still worked. When a site changes its page, only its adapter needs updating.

## Privacy

- No network requests: the code contains no `fetch`, `XMLHttpRequest`, `WebSocket`, or `sendBeacon`.
- Stores only on/off switches, on your device (`chrome.storage.local`).
- Never reads, stores, or logs your conversations.
- Permissions: `storage`, plus access to chatgpt.com, claude.ai, and gemini.google.com only.

When you send a message, the timestamp (including your time zone) goes to the AI service as part of that message. Full details in [PRIVACY.md](PRIVACY.md).



This project focuses on:

- showing the timestamp **before** sending, so the user can see, edit, or delete it
- separate on/off controls for each site
- no network code at all, verifiable by reading the source
- a documented test record ([TESTING.md](TESTING.md))

## Known limitations

- A draft left unsent for a long time keeps its original timestamp. Press Alt+T before sending to refresh it.
- Automatic mode may not trigger when typing with an IME (for example, some Malayalam, Chinese, or Japanese keyboards). Alt+T still works.
- Chrome disables extensions in Incognito windows by default. To use Context Clock there, enable "Allow in Incognito" on the extension's Details page.
- Each website can change its page at any time, which may break the integration until its adapter is updated.

## Development

Built step by step as a learning project, with AI assistance. The problem definition, design decisions, testing, and debugging are documented in this README, in [TESTING.md](TESTING.md), and in the commit history.

## License

[MIT](LICENSE)