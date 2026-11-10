// Context Clock popup — Stage 9
// Shows saved settings when opened, and saves every change immediately.
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
  const settings = await loadSettings();
  masterToggle.checked = settings.enabled;
  platformToggles.forEach((toggle) => {
    toggle.checked = settings[toggle.dataset.platform];
  });
  updatePlatformSectionState();
}

masterToggle.addEventListener("change", async () => {
  updatePlatformSectionState();
  await saveSetting("enabled", masterToggle.checked);
  console.log("[ContextClock] Saved master switch:", masterToggle.checked);
});

platformToggles.forEach((toggle) => {
  toggle.addEventListener("change", async () => {
    await saveSetting(toggle.dataset.platform, toggle.checked);
    console.log(`[ContextClock] Saved ${toggle.dataset.platform}:`, toggle.checked);
  });
});

showSavedSettings();
updatePreview();
setInterval(updatePreview, 1000);