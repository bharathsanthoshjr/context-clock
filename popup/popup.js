// Context Clock popup — v1.0.1
// Shows saved settings when opened, and saves every change immediately.
// When the master switch is off, every site switch shows as off (display only);
// each site's saved choice is kept and comes back when the master switch is turned on.
// If saving fails, the switch flips back so it never shows a state that wasn't saved.
// Uses: buildTimeContext (time-context.js), loadSettings and saveSetting (settings.js).

const masterToggle = document.getElementById("toggle-master");
const platformSection = document.getElementById("platform-section");
const platformToggles = document.querySelectorAll(".platform-toggle");
const preview = document.getElementById("preview");

// The user's saved choice for each site, e.g. { chatgpt: true, claude: false, gemini: true }.
const savedPlatformStates = {};

// When the master switch is off: fade the list, lock the switches, and show them all as off.
// When it's on: unlock them and show each site's saved choice.
function updatePlatformSectionState() {
  const isEnabled = masterToggle.checked;
  platformSection.classList.toggle("is-disabled", !isEnabled);
  platformToggles.forEach((toggle) => {
    toggle.disabled = !isEnabled;
    toggle.checked = isEnabled && savedPlatformStates[toggle.dataset.platform] === true;
  });
}

function updatePreview() {
  preview.textContent = buildTimeContext();
}

// Make the switches match what's saved.
async function showSavedSettings() {
  try {
    const settings = await loadSettings();
    masterToggle.checked = settings.enabled;
    platformToggles.forEach((toggle) => {
      const key = toggle.dataset.platform;
      savedPlatformStates[key] = settings[key];
    });
    updatePlatformSectionState();
  } catch (error) {
    console.error("[ContextClock] Could not load settings:", error);
  }
}

// Saves a switch. Returns true if saved; if saving fails, flips it back and returns false.
async function saveToggle(toggle, key) {
  try {
    await saveSetting(key, toggle.checked);
    console.log(`[ContextClock] Saved ${key}:`, toggle.checked);
    return true;
  } catch (error) {
    toggle.checked = !toggle.checked;
    console.error(`[ContextClock] Could not save ${key}; switch restored.`, error);
    return false;
  }
}

masterToggle.addEventListener("change", async () => {
  updatePlatformSectionState();
  const saved = await saveToggle(masterToggle, "enabled");
  if (!saved) {
    updatePlatformSectionState();
  }
});

platformToggles.forEach((toggle) => {
  toggle.addEventListener("change", async () => {
    const key = toggle.dataset.platform;
    const saved = await saveToggle(toggle, key);
    if (saved) {
      savedPlatformStates[key] = toggle.checked;
    }
  });
});

showSavedSettings();
updatePreview();
setInterval(updatePreview, 1000);