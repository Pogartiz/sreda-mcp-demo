const sceneButtons = [...document.querySelectorAll(".scene-tab")];
const scenes = [...document.querySelectorAll(".scene")];
const brand = document.querySelector(".brand");
const whyStepButtons = [...document.querySelectorAll(".why-step")];
const whyPanels = [...document.querySelectorAll(".why-panel")];

function colorizeLeaderboard() {
  const table = document.querySelector(".leaderboard-table");
  if (!table) return;

  const headers = [...table.querySelectorAll("thead th")];
  const rows = [...table.querySelectorAll("tbody tr")];

  headers.forEach((header, columnIndex) => {
    const direction = header.dataset.direction;
    if (!direction) return;

    const cells = rows.map((row) => row.cells[columnIndex]).filter(Boolean);
    const measured = cells
      .filter((cell) => !cell.classList.contains("pending-metric"))
      .map((cell) => ({ cell, value: Number.parseFloat(cell.textContent.replace(/[^\d.-]/g, "")) }))
      .filter(({ value }) => Number.isFinite(value));

    const uniqueValues = [...new Set(measured.map(({ value }) => value))].sort((a, b) => direction === "up" ? b - a : a - b);
    const bucketSize = Math.ceil(uniqueValues.length / 3);
    const highValues = new Set(uniqueValues.slice(0, bucketSize));
    const lowValues = new Set(uniqueValues.slice(-bucketSize));

    measured.forEach(({ cell, value }) => {
      cell.classList.remove("high", "mid", "low");
      cell.classList.add("score", highValues.has(value) ? "high" : lowValues.has(value) ? "low" : "mid");
    });
  });
}

function setWhyStep(name) {
  whyStepButtons.forEach((button) => {
    const isActive = button.dataset.whyStep === name;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  whyPanels.forEach((panel) => {
    const isActive = panel.dataset.whyPanel === name;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

function setScene(name, push = true) {
  const resolvedName = name === "add-task" ? "task" : name === "measure" ? "gigachat" : name;
  const sceneId = `scene-${resolvedName}`;
  const target = document.getElementById(sceneId);
  if (!target) return;

  scenes.forEach((scene) => {
    scene.classList.toggle("is-active", scene.id === sceneId);
  });

  sceneButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.scene === resolvedName);
  });

  if (resolvedName === "why") {
    setWhyStep("request");
  }

  if (push || resolvedName !== name) {
    history.replaceState(null, "", `#${resolvedName}`);
  }
}

sceneButtons.forEach((button) => {
  button.addEventListener("click", () => setScene(button.dataset.scene));
});

brand.addEventListener("click", () => setScene("why"));

whyStepButtons.forEach((button) => {
  button.addEventListener("click", () => setWhyStep(button.dataset.whyStep));
});

window.addEventListener("hashchange", () => {
  const name = window.location.hash.replace("#", "") || "why";
  setScene(name, false);
});

setScene(window.location.hash.replace("#", "") || "why", false);
colorizeLeaderboard();
