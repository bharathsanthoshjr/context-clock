// Context Clock popup — Stage 4
// Interface only: switches are NOT saved yet (that comes in Stage 9).

const masterToggle = document.getElementById("toggle-master");
const platformSection = document.getElementById("platform-section");
const platformToggles = document.querySelectorAll(".platform-toggle");

// When the master switch is off, fade the platform list and lock its switches.
function updatePlatformSectionState() {
  const isEnabled = masterToggle.checked;

  platformSection.classList.toggle("is-disabled", !isEnabled);

  platformToggles.forEach((toggle) => {
    toggle.disabled = !isEnabled;
  });
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