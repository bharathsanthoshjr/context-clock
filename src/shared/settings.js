// Context Clock — settings
// Reads and saves the user's switches in chrome.storage.local (on this device only).
// Shared by the popup and the content scripts.

// Used whenever a setting has never been saved, e.g. right after installing.
const SETTINGS_DEFAULTS = {
  enabled: true,
  chatgpt: true,
  claude: true,
  gemini: true,
};

// Reads all settings. Anything never saved falls back to SETTINGS_DEFAULTS.
async function loadSettings() {
  return chrome.storage.local.get(SETTINGS_DEFAULTS);
}

// Saves one setting, e.g. saveSetting("chatgpt", false).
async function saveSetting(key, value) {
  await chrome.storage.local.set({ [key]: value });
}

// True only if the extension is on AND this particular site is on.
function isPlatformActive(settings, platformId) {
  return Boolean(settings && settings.enabled && settings[platformId]);
}