# Privacy Policy: Context Clock

*Last updated: 11 November 2026*

## Summary

Context Clock does not collect, store, or transmit any personal data. It has no servers, no analytics, and no tracking.

## What the extension does

- It runs only on **chatgpt.com**, **claude.ai**, and **gemini.google.com**.
- It reads your computer's clock and time zone setting to build a timestamp.
- It checks whether the message box is empty, or already starts with a timestamp, so it knows when to insert one and never adds duplicates.
- It inserts the timestamp into your **unsent** message, where you can see, edit, or delete it.

## What the extension stores

Only your on/off settings (the master switch and one switch per site). They are saved in Chrome's local extension storage, on your device only, and are never synced or sent anywhere.

## What the extension never does

- It never reads, stores, or logs your conversations or messages.
- It never sends any data to the developer or to any third party.
- It never uses analytics, advertising, or tracking.
- It never loads code from the internet.

## What is shared, and with whom

When you **send** a message that contains the timestamp, the AI service you're using (OpenAI for ChatGPT, Anthropic for Claude, or Google for Gemini) receives the timestamp as part of your message, under that service's own privacy policy.

The timestamp includes your **time zone** (for example, `Asia/Calcutta`), which indicates your approximate region. If you'd rather not share it, delete the timestamp before sending, or switch the extension off for that site.

## Permissions

| Permission | Why it's needed |
|---|---|
| `storage` | To remember your on/off settings |
| Access to chatgpt.com, claude.ai, gemini.google.com | To insert the timestamp into the message box on those sites only |

## Verify it yourself

The source code is public: https://github.com/bharathsanthoshjr/context-clock

The privacy checks used to confirm these statements are listed in section C of [TESTING.md](TESTING.md).

## Contact

For questions, open an issue: https://github.com/bharathsanthoshjr/context-clock/issues