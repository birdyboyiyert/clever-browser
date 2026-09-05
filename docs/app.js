"use strict";

const frame = document.getElementById("frame");
const address = document.getElementById("address");
const navForm = document.getElementById("nav-form");
const btnBack = document.getElementById("btn-back");
const btnFwd = document.getElementById("btn-fwd");
const btnReload = document.getElementById("btn-reload");
const btnNewTab = document.getElementById("btn-newtab");
const blankHint = document.getElementById("blank-hint");

let history = [];
let historyIndex = -1;
let currentUrl = null;

function normalize(input) {
  const raw = input.trim();
  if (!raw) return null;

  // Looks like a URL (has a scheme, or a dot with no spaces) -> treat as address.
  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw);
  const looksLikeDomain = !raw.includes(" ") && /\.[a-z]{2,}([/:?#]|$)/i.test(raw);

  if (hasScheme) return raw;
  if (looksLikeDomain) return "https://" + raw;

  // Otherwise treat it as a search query.
  return "https://duckduckgo.com/html/?q=" + encodeURIComponent(raw);
}

function go(url, { push = true } = {}) {
  const normalized = normalize(url);
  if (!normalized) return;

  currentUrl = normalized;
  address.value = normalized;
  frame.src = normalized;
  blankHint.classList.add("hidden");
  btnNewTab.dataset.url = normalized;

  if (push) {
    history = history.slice(0, historyIndex + 1);
    history.push(normalized);
    historyIndex = history.length - 1;
  }
  updateNavButtons();
}

function updateNavButtons() {
  btnBack.disabled = historyIndex <= 0;
  btnFwd.disabled = historyIndex >= history.length - 1;
}

navForm.addEventListener("submit", (e) => {
  e.preventDefault();
  go(address.value);
});

btnBack.addEventListener("click", () => {
  if (historyIndex > 0) {
    historyIndex--;
    go(history[historyIndex], { push: false });
    updateNavButtons();
  }
});

btnFwd.addEventListener("click", () => {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    go(history[historyIndex], { push: false });
    updateNavButtons();
  }
});

btnReload.addEventListener("click", () => {
  if (currentUrl) frame.src = currentUrl;
});

btnNewTab.addEventListener("click", () => {
  const url = btnNewTab.dataset.url || currentUrl;
  if (url) window.open(url, "_blank", "noopener");
});

document.querySelectorAll("[data-url]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    go(el.dataset.url);
  });
});

address.focus();
