document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["decisions"], (result) => {
    const decisions = result.decisions || [];

    const total = decisions.length;
    const wants = decisions.filter(d => d.type === "want").length;

    document.getElementById("total").textContent = total;
    document.getElementById("wants").textContent = wants;
  });

  document.getElementById("clear").addEventListener("click", () => {
    chrome.storage.local.set({ decisions: [] }, () => {
      document.getElementById("total").textContent = 0;
      document.getElementById("wants").textContent = 0;
    });
  });
});