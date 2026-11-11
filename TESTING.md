# Testing

Manual test record for Context Clock. All tests were run by hand by the developer.

## Test environment

- **Extension version:** 0.1.0
- **Browser:** Google Chrome 156.0.8078.73 (Official Build, 64-bit)
- **Operating system:** Windows 11 Home, version 25H2 (build 26200.8894)
- **Sites:** chatgpt.com, claude.ai, gemini.google.com

Results were recorded during development, right after each feature was built. A full regression pass of every test on the final code has not yet been completed (see "Gaps" below).

**Legend:** ✅ passed · ⬜ not yet tested · ✅\* failed at first, fixed, then passed

## A. Insertion (tested 6 Nov 2026)

| ID | Test | Expected | ChatGPT | Claude | Gemini |
|---|---|---|---|---|---|
| A1 | Load the page | Console shows the extension loaded | ✅ | ✅ | ✅ |
| A2 | Type into an empty message box | Timestamp added in front; first letter in place | ✅ | ✅ | ✅ |
| A3 | Send the message | Sent message contains the timestamp | ✅ | ✅ | ✅ |
| A4 | Paste into an empty message box | Timestamp added in front | ✅\* | ✅ | ✅ |
| A5 | Press Alt+T twice | Only one timestamp | ✅ | ✅ | ✅ |
| A6 | Type text first, then press Alt+T | Timestamp inserted before the text | ✅ | ⬜ | ⬜ |
| A7 | Delete only the timestamp, keep typing | Timestamp does not come back | ✅ | ✅ | ✅ |
| A8 | Clear the box completely, type again | Timestamp comes back | ✅ | ✅ | ✅ |
| A9 | Open an old chat, then a new chat, then type | Timestamp appears in the visible new box | ✅\* | ✅ | ✅ |
| A10 | Edit an already-sent message | Nothing added or changed automatically | ✅ | ⬜ | ⬜ |

## B. Settings (tested 10 Nov 2026)

| ID | Test | Expected | Result |
|---|---|---|---|
| B1 | Turn one site off | No timestamp on that site; other sites still work | ✅ |
| B2 | Turn it back on, without reloading | Works immediately | ✅ |
| B3 | Master switch off, then on | Nothing anywhere while off; each site's switch kept | ✅ |
| B4 | Restart Chrome | Settings unchanged | ✅ |
| B5 | Use an Incognito window | Extension does not run (Chrome's default) | ✅ (observed 6 Nov) |

## C. Privacy audit (tested 11 Nov 2026)

| ID | Check | Evidence | Result |
|---|---|---|---|
| C1 | No network code | Code search for `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`: no results. `http` appears only in the three site patterns in `manifest.json` | ✅ |
| C2 | No message text in logs | Every `console.` call prints a fixed message | ✅ |
| C3 | Stored data | `chrome.storage.local` holds only on/off values, e.g. `{chatgpt: false}` | ✅ |
| C4 | Permissions | Only `storage`, plus access to the three sites | ✅ |

## Bugs found during testing

| Bug | Cause | Fix |
|---|---|---|
| Nothing happened on ChatGPT | The manifest loaded only 2 of the 4 script files | Listed all files in the correct order |
| After opening an old chat, the timestamp went into a hidden box | ChatGPT keeps old message boxes in the page; the code took the first match | Prefer the focused box, then the first visible one (commit `07ed65e`) |
| Pasting into an empty box added no timestamp | The editor handles pasting itself, so the browser's `beforeinput` event never fires | Also listen for the `paste` event (commit `d5f4554`) |

## Gaps

- A6 and A10 have not been tested on Claude or Gemini.
- After the settings and error-handling changes (Stages 9–10), all insertion tests were re-checked on ChatGPT, but only partly on Claude and Gemini.
- Not tested: other Chromium browsers (Edge, Brave), macOS or Linux, IME typing (e.g. some Malayalam keyboards), and drafts left unsent for a long time.
- In tests, ChatGPT and Claude correctly noticed a "good morning" sent at night. Both apps may also give the model their own time information, so a comparison with the extension switched off has not been done yet.