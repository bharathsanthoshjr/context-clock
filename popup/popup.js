// Context Clock popup — Stage 10
// Shows saved settings when opened, and saves every change immediately.
// If saving fails, the switch flips back so it never shows a state that wasn't saved.
// Uses: buildTimeContext (time-context.js), loadSettings and saveSetting (settings.js).

const masterToggle = document.getElementById("toggle-master");
const platformSection = document.getElementById("platform-section");
const platformToggles = document.querySelectorAll(".platform-toggle");
const preview = document.getElementById("preview");

// When the master switch is off, fade the platform list and lock its switches.
function updatePlatformSectionState() {
  const isEnabled = masterToggle.checked;
  platformSection.classList.toggle("is-disabled", !isEnabled);
  platformToggles.forEach((toggle) => {
    toggle.disabled = !isEnabled;
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
      toggle.checked = settings[toggle.dataset.platform];
    });
    updatePlatformSectionState();
  } catch (error) {
    console.error("[ContextClock] Could not load settings:", error);
  }
}

// Saves a switch. If saving fails, flips it back so the popup stays truthful.
async function saveToggle(toggle, key) {
  try {
    await saveSetting(key, toggle.checked);
    console.log(`[ContextClock] Saved ${key}:`, toggle.checked);
  } catch (error) {
    toggle.checked = !toggle.checked;
    updatePlatformSectionState();
    console.error(`[ContextClock] Could not save ${key}; switch restored.`, error);
  }
}

masterToggle.addEventListener("change", () => {
  updatePlatformSectionState();
  saveToggle(masterToggle, "enabled");
});

platformToggles.forEach((toggle) => {
  toggle.addEventListener("change", () => {
    saveToggle(toggle, toggle.dataset.platform);
  });
});

showSavedSettings();
updatePreview();
setInterval(updatePreview, 1000);