// Context Clock popup — Stage 5
// Switches are NOT saved yet (that comes in Stage 9).
// buildTimeContext() comes from src/shared/time-context.js, loaded before this file.

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

// Show the current context line in the Preview box.
function updatePreview() {
  preview.textContent = buildTimeContext();
}

masterToggle.addEventListener("change", () => {
  console.log("[ContextClock] Master switch:", masterToggle.checked);
  updatePlatformSectionState();
});

platformToggles.forEach((toggle) => {
  toggle.addEventListener("change", () => {
    console.log(`[ContextClock] ${toggle.dataset.platform}:`, toggle.checked);
  });
});

// Set the correct state as soon as the popup opens.
updatePlatformSectionState();
updatePreview();

// Refresh the preview every second so the time stays current while the popup is open.
setInterval(updatePreview, 1000);