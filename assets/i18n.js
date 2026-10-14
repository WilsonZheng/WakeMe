// Tiny two-language switcher. Picks Chinese for zh-* browsers, English otherwise,
// and remembers a manual choice in localStorage.
const STRINGS = {
  en: {
    "brand.toggle": "中文",
    "home.title": "Keep your iPhone screen on.",
    "home.lead": "Open a link, and the screen stays awake. No app, no settings.",
    "home.on.title": "Stay awake",
    "home.on.body": "Opens and immediately stops your iPhone from auto-locking while the page is on screen.",
    "home.off.title": "Back to normal",
    "home.off.body": "Releases the wake lock so Auto-Lock works again.",
    "home.tip": "<strong>Tip:</strong> add the Stay awake link to your Home Screen (Share, then Add to Home Screen) for one-tap access.",
    "on.title": "Screen stays on",
    "on.lead": "Keep this page open and visible. Your iPhone will not auto-lock.",
    "on.starting": "Starting…",
    "on.awake": "Awake",
    "on.paused": "Paused",
    "on.pausedHint": "Come back to this tab to resume",
    "on.unsupported": "Not supported",
    "on.unsupportedHint": "Update iOS to 16.4 or later",
    "on.stop": "Stop, allow Auto-Lock",
    "on.tapTitle": "Tap anywhere",
    "on.tapBody": "Safari needs one tap before it lets a page keep the screen on.",
    "on.rules": "<strong>It stops on its own when you:</strong><ol><li>switch to another tab or app,</li><li>lock the phone with the side button,</li><li>turn on Low Power Mode on older iOS versions.</li></ol>Return to this page and it turns back on.",
    "off.title": "Auto-Lock is back",
    "off.lead": "The wake lock is released. Your iPhone will lock on its normal timer.",
    "off.state": "Off",
    "off.stateHint": "Normal Auto-Lock",
    "off.again": "Keep screen on again",
    "off.forever": "<strong>Want Auto-Lock off permanently?</strong> A website cannot change iOS settings, but you can:<ol><li>Open Settings.</li><li>Go to Display &amp; Brightness, then Auto-Lock.</li><li>Choose Never.</li></ol>",
    footer: "iOSWakeMe uses the Screen Wake Lock API. Nothing is stored or sent.",
  },
  zh: {
    "brand.toggle": "EN",
    "home.title": "让 iPhone 屏幕一直亮着。",
    "home.lead": "打开一个链接，屏幕就不会自动锁定。不用装 App，也不用改设置。",
    "home.on.title": "保持常亮",
    "home.on.body": "打开就生效，只要页面在前台，iPhone 就不会自动锁屏。",
    "home.off.title": "恢复正常",
    "home.off.body": "释放常亮，让自动锁定重新生效。",
    "home.tip": "<strong>小技巧：</strong>把“保持常亮”链接添加到主屏幕（分享，然后选“添加到主屏幕”），以后一点就开。",
    "on.title": "屏幕保持常亮",
    "on.lead": "让这个页面保持打开并显示在屏幕上，iPhone 就不会自动锁定。",
    "on.starting": "启动中…",
    "on.awake": "常亮中",
    "on.paused": "已暂停",
    "on.pausedHint": "回到这个页面会自动恢复",
    "on.unsupported": "不支持",
    "on.unsupportedHint": "请升级到 iOS 16.4 或更高版本",
    "on.stop": "停止，恢复自动锁定",
    "on.tapTitle": "点一下屏幕",
    "on.tapBody": "Safari 需要你先点一下，才允许网页保持屏幕常亮。",
    "on.rules": "<strong>以下情况会自动停止：</strong><ol><li>切换到其他标签页或 App，</li><li>按侧边键锁屏，</li><li>旧版 iOS 打开了低电量模式。</li></ol>回到这个页面就会重新生效。",
    "off.title": "自动锁定已恢复",
    "off.lead": "常亮已释放，iPhone 会按原来的时间自动锁屏。",
    "off.state": "已关闭",
    "off.stateHint": "正常自动锁定",
    "off.again": "重新保持常亮",
    "off.forever": "<strong>想永久关闭自动锁定？</strong>网页没法修改 iOS 设置，但你可以手动改：<ol><li>打开“设置”。</li><li>进入“显示与亮度”，再点“自动锁定”。</li><li>选择“永不”。</li></ol>",
    footer: "iOSWakeMe 使用 Screen Wake Lock API，不存储也不上传任何数据。",
  },
};

const KEY = "wakeme.lang";

export let lang =
  localStorage.getItem(KEY) || (navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en");

export function t(key) {
  return STRINGS[lang][key] ?? STRINGS.en[key] ?? key;
}

export function applyI18n() {
  document.documentElement.lang = lang === "zh" ? "zh-Hans" : "en";
  for (const el of document.querySelectorAll("[data-i18n]")) {
    el.innerHTML = t(el.dataset.i18n);
  }
}

export function setupLangToggle(onChange) {
  const btn = document.querySelector(".lang");
  btn?.addEventListener("click", (e) => {
    e.stopPropagation();
    lang = lang === "zh" ? "en" : "zh";
    localStorage.setItem(KEY, lang);
    applyI18n();
    onChange?.();
  });
  applyI18n();
}
