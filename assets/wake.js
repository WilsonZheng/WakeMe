import { setupLangToggle, t } from "./i18n.js";

// Keeps the screen awake while this page is visible.
// 1. Screen Wake Lock API (Safari 16.4+, Chrome 84+), tried immediately on load.
// 2. If the browser wants a user gesture first, show a full-screen "tap anywhere" layer.
// 3. On browsers without the API, loop a tiny muted inline video (the NoSleep.js trick).
// The lock is dropped by the browser whenever the page is hidden, so we re-acquire on return.

const root = document.body;
const label = document.querySelector("#state");
const hint = document.querySelector("#hint");

let lock = null;
let state = "starting";
let awakeSince = 0;
let video = null;

function render() {
  root.dataset.state = state;
  const text = {
    starting: [t("on.starting"), ""],
    awake: [t("on.awake"), elapsed()],
    "needs-tap": [t("on.starting"), ""],
    paused: [t("on.paused"), t("on.pausedHint")],
    unsupported: [t("on.unsupported"), t("on.unsupportedHint")],
  }[state];
  label.textContent = text[0];
  hint.textContent = text[1];
}

function setState(next) {
  if (next === "awake" && state !== "awake") awakeSince = Date.now();
  state = next;
  render();
}

function elapsed() {
  const s = Math.floor((Date.now() - awakeSince) / 1000);
  const h = Math.floor(s / 3600);
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${m}:${sec}` : `${m}:${sec}`;
}

function getVideo() {
  if (!video) {
    video = document.createElement("video");
    video.className = "keepalive";
    video.src = "/assets/blank.mp4";
    video.muted = true;
    video.loop = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("muted", "");
    video.setAttribute("aria-hidden", "true");
    document.body.append(video);
  }
  return video;
}

async function acquire() {
  if (document.visibilityState !== "visible") {
    setState("paused");
    return;
  }

  if ("wakeLock" in navigator) {
    try {
      lock = await navigator.wakeLock.request("screen");
      lock.addEventListener("release", () => {
        lock = null;
        if (state === "awake") setState(document.visibilityState === "visible" ? "needs-tap" : "paused");
      });
      setState("awake");
      return;
    } catch {
      // NotAllowedError: Safari wants a tap first. Fall through to the overlay.
      setState("needs-tap");
      return;
    }
  }

  try {
    await getVideo().play();
    setState("awake");
  } catch {
    setState(video ? "needs-tap" : "unsupported");
  }
}

function release() {
  lock?.release().catch(() => {});
  lock = null;
  video?.pause();
}

// Any tap while waiting for a gesture retries with user activation.
document.addEventListener("click", () => {
  if (state === "needs-tap") acquire();
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    if (!lock) acquire();
  } else if (state === "awake") {
    video?.pause();
    setState("paused");
  }
});

document.querySelector("#stop").addEventListener("click", release);
window.addEventListener("pagehide", release);

setInterval(() => state === "awake" && render(), 1000);
setupLangToggle(render);
render();
acquire();
