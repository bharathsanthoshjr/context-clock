# Context Clock

A privacy-first Chrome extension that adds the user's local date, time, and time zone to messages on ChatGPT, Claude, and Gemini.

## The problem

AI chat assistants can't tell how much time has passed between messages. In one conversation, an assistant said "we'll continue tomorrow." A few minutes later, the user said "good morning," and the assistant treated it as the next day.

Context Clock adds a visible timestamp to each new message, so the assistant has the information it needs to notice the real time.

## Status

🚧 In development.

| Platform | Status |
|---|---|
| ChatGPT | ✅ Working, tested manually on 6 Nov 2026 |
| Claude | ✅ Working, tested manually on 6 Nov 2026 |
| Gemini | Not yet built |

## How it works

- **Automatic:** when you start typing or paste into an empty message box, a line like `[Sent: Fri 6 Nov 2026, 21:23 (Asia/Calcutta, UTC+05:30)]` is added at the start. It's visible, so you can edit or delete it before sending.
- **Manual:** press **Alt+T** to insert the timestamp or refresh it to the current time.

## Known limitations

- A draft left unsent for a long time keeps its original timestamp. Press Alt+T before sending to refresh it.
- Automatic mode may not trigger when typing with an IME (for example, some Malayalam, Chinese or Japanese keyboards). Alt+T still works.
- Each website can change its page at any time, which may break the integration until it's updated.
- Chrome disables extensions in Incognito windows by default. To use Context Clock there, enable "Allow in Incognito" on the extension's Details page.