chrome.storage.local.get(["decisions"], (result) => {
  const log = document.getElementById("log");
  const decisions = result.decisions || [];

  if (decisions.length === 0) {
    log.innerHTML = "<p>No decisions yet.</p>";
    return;
  }

  decisions.reverse().forEach(decision => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <strong>${decision.type || "Undecided"}</strong><br>
      Wait: ${decision.wait ? "Yes" : "No"}<br>
      Similar: ${decision.own ? "Yes" : "No"}<br>
      <small>${new Date(decision.time).toLocaleString()}</small>
    `;
    log.appendChild(div);
  });
});