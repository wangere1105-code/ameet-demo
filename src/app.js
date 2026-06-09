import { characters, filters, chatChoices, memories, replayOptions, getCharacter } from "./data.js";

const app = document.querySelector("#app");

const icons = {
  back: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>`,
  search: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
  send: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`,
  smile: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>`,
  home: `<svg viewBox="0 0 24 24"><path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/></svg>`,
  people: `<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a5 5 0 0 1 10 0v2M16 4a3 3 0 0 1 0 6M17 13a5 5 0 0 1 4 5v2"/></svg>`,
  book: `<svg viewBox="0 0 24 24"><path d="M4 5a3 3 0 0 1 3-3h5v19H7a3 3 0 0 0-3 3ZM20 5a3 3 0 0 0-3-3h-5v19h5a3 3 0 0 1 3 3Z"/></svg>`,
  message: `<svg viewBox="0 0 24 24"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/></svg>`,
  user: `<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>`,
};

const portrait = (character, className = "") =>
  `<div class="portrait ${className}" style="--portrait-position:${character.sheetPosition}" role="img" aria-label="${character.name}"></div>`;

const currentPath = () => location.hash.slice(1) || location.pathname;

function navigate(path) {
  history.pushState({}, "", `/#${path}`);
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function topBar({ back = false, title = "Ameet", action = "" } = {}) {
  return `<header class="top-bar">
    ${back ? `<button class="icon-button" data-back aria-label="Back">${icons.back}</button>` : `<a class="brand" href="/">Ameet</a>`}
    ${back ? `<div class="top-title">${title}</div>` : `<div class="top-actions"><a href="/account">Sign in</a><a class="mini-cta" href="/characters">Start Free</a></div>`}
    ${back ? action || `<span class="top-spacer"></span>` : ""}
  </header>`;
}

function hexCharacter(character, index) {
  const activity = {
    chloe: "New message",
    ava: "2:17 AM",
    vanessa: "Scene locked",
    riley: "Online now",
    elena: "1 prompt",
    mina: "Continue · 72%",
  }[character.id];
  return `<button class="hex-character hex-${index + 1} ${character.id === "mina" ? "active" : ""}" data-hex-character="${character.id}" aria-label="Select ${character.name}">
    ${portrait(character)}
    <span>${character.shortName}</span>
    <small>${activity}</small>
  </button>`;
}

function storyProfile(character) {
  return `<article class="story-profile" id="story-profile" aria-live="polite">
    <button class="profile-close" data-close-profile aria-label="Close profile">×</button>
    <div class="profile-image">
      ${portrait(character, "profile-portrait")}
      <div class="profile-image-shade"></div>
      <button class="heart-button profile-favorite" aria-label="Favorite ${character.name}">${icons.heart}</button>
    </div>
    <div class="profile-content">
      <span class="section-label">${character.type} relationship</span>
      <h2>${character.name}</h2>
      <h3>${character.title}</h3>
      <blockquote>“${character.hook}”</blockquote>
      <div class="profile-tags">${character.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
      <div class="profile-story">
        <span>First Story</span>
        <strong>${character.story.title}</strong>
        <p>${character.story.premise}</p>
      </div>
      <div class="profile-progress">
        ${character.story.nodes.map((node, index) => `<i class="${index < 2 ? "done" : ""} ${index === 2 ? "current" : ""}"><span>${index + 1}</span><small>${node.title}</small></i>`).join("")}
      </div>
      <a class="primary-button" href="/chat/${character.id}">${character.cta} ${icons.arrow}</a>
    </div>
  </article>`;
}

function unifiedHomePage() {
  const selected = getCharacter("mina");
  return `<main class="unified-home page-shell">
    <header class="unified-header">
      <a class="brand" href="/">Ameet</a>
      <div class="header-greeting"><span>Good evening, Alex</span><strong>Who do you want to meet tonight?</strong></div>
      <a class="account-avatar small" href="/login" aria-label="Sign in">A</a>
    </header>

    <section class="connection-section" id="characters">
      <div class="home-intro">
        <span class="section-label">Your connections</span>
        <h1>Six stories.<br><em>One night to begin.</em></h1>
        <p>Choose a character around the constellation. Every connection moves at its own pace.</p>
      </div>
      <div class="constellation" aria-label="Choose a character">
        <svg class="star-lines" viewBox="0 0 100 100" aria-hidden="true">
          <polygon points="50,5 89,28 89,72 50,95 11,72 11,28"/>
          <path d="M50 5 89 72 11 72Z M11 28 89 28 50 95Z"/>
        </svg>
        ${characters.map(hexCharacter).join("")}
        <div class="constellation-core" aria-hidden="true"><span>✦</span><strong>Choose<br>a story</strong><small>Tap a character</small></div>
        ${storyProfile(selected)}
      </div>
    </section>
    <footer class="home-safety">Private by design · 18+ optional mature mode · Always boundary-aware</footer>
  </main>`;
}

function characterCard(character) {
  return `<article class="character-card" data-character="${character.id}">
    <a href="/characters/${character.id}" class="card-image">${portrait(character)}<span class="card-type">${character.type}</span></a>
    <div class="card-body">
      <div><h3>${character.name}</h3><p>${character.title}</p></div>
      <button class="heart-button" aria-label="Favorite ${character.name}">${icons.heart}</button>
    </div>
    <p class="card-hook">${character.hook}</p>
    <a class="card-cta" href="/characters/${character.id}">${character.cta} ${icons.arrow}</a>
  </article>`;
}

function charactersPage() {
  return `<main class="mobile-app page-shell">
    ${topBar({ title: "Characters" })}
    <section class="list-header">
      <div><h1>Choose the kind of connection you want tonight.</h1><p>Six stories. Six different ways to be seen.</p></div>
      <button class="icon-button">${icons.search}</button>
    </section>
    <div class="filters">${filters.map((filter) => `<button class="${filter === "All" ? "active" : ""}" data-filter="${filter}">${filter}</button>`).join("")}</div>
    <section class="character-grid">${characters.map(characterCard).join("")}</section>
  </main>`;
}

function nodeProgress(character) {
  return `<div class="node-progress">${character.story.nodes.map((node, index) => `<div class="node ${index === 0 ? "active" : ""} ${node.access !== "free" ? "locked" : ""}">
    <span>${index + 1}</span><strong>${node.title}</strong><small>${node.access === "free" ? "Free" : "Locked"}</small>
  </div>`).join("")}</div>`;
}

function detailPage(character) {
  return `<main class="detail-page page-shell">
    ${topBar({ back: true, title: character.shortName, action: `<button class="icon-button favorite">${icons.heart}</button>` })}
    <section class="character-hero">
      ${portrait(character, "detail-portrait")}
      <div class="hero-shade"></div>
      <div class="detail-copy">
        <h1>${character.name}</h1><h2>${character.title}</h2>
        <div class="tag-row">${character.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        <blockquote>“${character.hook}”</blockquote>
        <div class="social-proof"><div>${characters.slice(0, 4).map((item) => portrait(item, "tiny")).join("")}</div><span>23.4K players are exploring her story</span></div>
        <a class="primary-button" href="/chat/${character.id}">Start Story ${icons.arrow}</a>
        <button class="secondary-button" data-preview>Preview Opening</button>
      </div>
    </section>
    <section class="story-info">
      <span class="section-label">First Story</span>
      <h2>${character.story.title}</h2><p>${character.story.premise}</p>
      ${nodeProgress(character)}
      <h3>How this relationship works</h3>
      <ul><li>She notices what you don’t say.</li><li>She respects boundaries.</li><li>She opens up when you earn her trust.</li></ul>
    </section>
  </main>`;
}

function chatPage(character) {
  return `<main class="chat-page page-shell">
    <header class="chat-header">
      <button class="icon-button" data-back>${icons.back}</button>
      ${portrait(character, "chat-avatar")}
      <div class="chat-person"><strong>${character.shortName}</strong><span>Private Attention</span></div>
      <div class="affection">♥ <span id="affection-value">72%</span></div>
      <label class="mature-toggle"><span>Mature<br>Mode</span><input type="checkbox" id="mature-toggle"><i></i></label>
    </header>
    <section class="story-status">
      <strong>${character.story.title}</strong><span>Node 2 / 5 · ${character.story.setting}</span>
      <div class="progress"><i style="width:38%"></i></div>
    </section>
    <section class="goal-card"><div><span>Goal</span><p>${character.story.goal}</p></div><button class="hint-button" data-hint>💡 Hint</button></section>
    <section class="messages" id="messages">
      <div class="message-row ai">${portrait(character, "message-avatar")}<div class="bubble">${character.story.openingLine}<time>22:41</time></div></div>
      <div class="message-row user"><div class="bubble">Maybe a little of both.<time>22:41 ✓✓</time></div></div>
      <div class="message-row ai">${portrait(character, "message-avatar")}<div class="bubble">That’s a safe answer.<time>22:42</time></div></div>
      <div class="narrator"><strong>Narrator</strong><p>She studies you for a moment, then takes a slow sip of her tea.</p><time>22:42</time></div>
      <div class="choice-card"><strong>What do you say?</strong>${chatChoices.map((choice) => `<button data-choice="${choice.id}"><span>${choice.id}</span>${choice.text}</button>`).join("")}</div>
    </section>
    <form class="composer" id="composer"><input id="message-input" placeholder="Say something..." autocomplete="off"><button type="button" class="icon-button">${icons.plus}</button><button type="button" class="icon-button">${icons.smile}</button><button class="send-button" aria-label="Send">${icons.send}</button></form>
    <div class="chat-actions"><button data-replay>Replay Moment</button><button data-paywall>Unlock Next Scene</button></div>
  </main>`;
}

function accountPage() {
  return `<main class="account-page page-shell">
    ${topBar({ back: true, title: "Account" })}
    <section class="account-header"><div class="account-avatar">A</div><div><span>Welcome back,</span><h1>Alex</h1><small>Free Plan</small></div><button class="mini-cta">Upgrade</button></section>
    <section class="usage-grid"><article><span>Today’s messages</span><strong>12<small>/20</small></strong></article><article><span>Active stories</span><strong>3</strong></article><article><span>Scenes unlocked</span><strong>5</strong></article></section>
    <section class="memory-section"><span class="section-label">Character Memory</span><h2>They remember what matters.</h2>
      ${memories.map((memory) => { const character = getCharacter(memory.characterId); return `<article class="memory-row">${portrait(character, "memory-avatar")}<div><p>${memory.text}</p><div class="memory-progress"><i style="width:${memory.progress}%"></i></div></div><strong>${memory.progress}%</strong></article>`; }).join("")}
    </section>
    <nav class="account-menu">${["My Stories", "My Favorites", "Replay Moments", "Memory", "Settings", "Help & Safety", "Log out"].map((item) => `<button><span>${item}</span>${icons.arrow}</button>`).join("")}</nav>
  </main>`;
}

function loginPage() {
  return `<main class="login-page page-shell">
    ${topBar({ back: true, title: "Welcome" })}
    <section class="login-visual">
      ${portrait(getCharacter("mina"), "login-portrait")}
      <div class="login-shade"></div>
      <div class="login-intro">
        <a class="brand" href="/">Ameet</a>
        <h1>Your story<br>is waiting.</h1>
        <p>Sign in to keep every conversation, memory, and unlocked scene with you.</p>
      </div>
    </section>
    <section class="login-panel">
      <div class="login-step active" id="login-step">
        <span class="section-label">Member sign in</span>
        <h2>Sign in to Ameet</h2>
        <p>We’ll send a secure sign-in link to your email.</p>
        <form id="login-form">
          <label>Email address<input type="email" id="login-email" placeholder="you@example.com" required autocomplete="email"></label>
          <button class="primary-button">Continue</button>
        </form>
        <div class="login-divider"><span>or</span></div>
        <button class="secondary-button" data-demo-login>Continue with demo account</button>
        <small>By continuing, you agree to our Terms and Privacy Policy.</small>
      </div>
    </section>
  </main>`;
}

function inviteGate() {
  return `<main class="invite-gate page-shell">
    <section class="gate-visual">
      ${portrait(getCharacter("mina"), "gate-portrait")}
      <div class="gate-shade"></div>
      <a class="brand" href="/">Ameet</a>
      <div class="gate-copy"><span>Private beta</span><h1>Some stories<br>begin quietly.</h1><p>Ameet is currently available by invitation only.</p></div>
    </section>
    <section class="gate-panel">
      <div class="gate-form">
        <span class="section-label">Invitation required</span>
        <h2>Enter your invite code</h2>
        <p>Use the 6-digit code included with your private beta invitation.</p>
        <form id="invite-form">
          <div class="invite-code" aria-label="6 digit invite code">
            ${Array.from({ length: 6 }, (_, index) => `<input inputmode="numeric" pattern="[0-9]*" maxlength="1" aria-label="Digit ${index + 1}" data-code-digit>`).join("")}
          </div>
          <p class="invite-feedback" id="invite-feedback"></p>
          <button class="primary-button">Enter Ameet</button>
        </form>
        <small>Demo code: 111111</small>
      </div>
    </section>
  </main>`;
}

function modal(type, character) {
  if (type === "mature") return `<div class="modal-backdrop" data-close-modal><section class="modal-panel mature-modal" role="dialog" aria-modal="true">
    <button class="modal-close" data-close-modal>×</button><div class="modal-symbol">18+</div><h2>Enter Private Mode?</h2>
    <p>Private Mode unlocks more mature emotional tension and private story scenes.</p><p>It is for adults only and still follows clear safety boundaries.</p>
    <label><input type="checkbox" class="consent"> I confirm I am 18 or older.</label><label><input type="checkbox" class="consent"> I understand boundaries still apply.</label>
    <button class="primary-button" id="enter-private">Enter Private Mode</button><button class="secondary-button" data-close-modal>Stay in Standard Mode</button>
  </section></div>`;
  if (type === "replay") return `<div class="modal-backdrop" data-close-modal><section class="modal-panel replay-modal" role="dialog" aria-modal="true">
    <button class="modal-close" data-close-modal>×</button><div class="modal-symbol">↶</div><h2>Replay This Moment?</h2><p>You moved too fast.<br>${character.shortName} noticed.</p><span>Choose a different approach.</span>
    <div class="replay-options">${replayOptions.map((option) => `<button>＋ ${option}</button>`).join("")}</div>
    <button class="primary-button" data-close-modal>Replay — $0.99</button><button class="secondary-button" data-close-modal>Continue from here</button>
  </section></div>`;
  return `<div class="modal-backdrop" data-close-modal><section class="modal-panel paywall-modal" role="dialog" aria-modal="true">
    <button class="modal-close" data-close-modal>×</button>${portrait(character, "paywall-portrait")}<div class="paywall-content"><h2>${character.paywall.title}</h2><p>${character.paywall.subtitle}</p>
    <ul><li>♡ Private scene</li><li>♡ More intimacy</li><li>♡ Story continues</li></ul>
    <button class="primary-button" data-close-modal>${character.paywall.cta} — ${character.paywall.price}</button><button class="secondary-button" data-close-modal>Maybe later</button><small>18+ only · Boundaries always apply</small></div>
  </section></div>`;
}

function render() {
  const path = currentPath();
  if (sessionStorage.getItem("ameet-invite-access") !== "granted") {
    app.innerHTML = inviteGate();
    bindEvents();
    return;
  }
  let html;
  if (path === "/" || path === "/characters") html = unifiedHomePage();
  else if (path.startsWith("/characters/")) html = detailPage(getCharacter(path.split("/")[2]));
  else if (path.startsWith("/chat/")) html = chatPage(getCharacter(path.split("/")[2]));
  else if (path === "/account") html = accountPage();
  else if (path === "/login") html = loginPage();
  else html = unifiedHomePage();
  app.innerHTML = html;
  bindEvents();
}

function openModal(type, character = getCharacter(currentPath().split("/")[2])) {
  document.body.insertAdjacentHTML("beforeend", modal(type, character));
  bindModalEvents();
}

function bindModalEvents() {
  document.querySelectorAll("[data-close-modal]").forEach((element) => element.addEventListener("click", (event) => {
    if (event.target === element || element.matches("button")) document.querySelector(".modal-backdrop")?.remove();
  }));
  document.querySelector("#enter-private")?.addEventListener("click", () => {
    const checks = [...document.querySelectorAll(".consent")];
    if (checks.every((check) => check.checked)) {
      document.querySelector(".modal-backdrop")?.remove();
      const toggle = document.querySelector("#mature-toggle");
      if (toggle) toggle.checked = true;
    } else {
      checks.forEach((check) => check.closest("label").classList.toggle("needs-check", !check.checked));
    }
  });
}

function addUserMessage(text) {
  const messages = document.querySelector("#messages");
  if (!messages || !text.trim()) return;
  messages.insertAdjacentHTML("beforeend", `<div class="message-row user fresh"><div class="bubble">${text}<time>Now ✓✓</time></div></div>`);
  messages.querySelector(".choice-card")?.remove();
  setTimeout(() => {
    messages.insertAdjacentHTML("beforeend", `<div class="narrator fresh"><strong>Narrator</strong><p>Her expression softens, almost too quickly to catch.</p><time>Now</time></div>`);
    messages.scrollTo({ top: messages.scrollHeight, behavior: "smooth" });
  }, 350);
  messages.scrollTo({ top: messages.scrollHeight, behavior: "smooth" });
}

function bindEvents() {
  document.querySelectorAll("a[href^='/']:not([data-home-section])").forEach((link) => {
    const path = link.getAttribute("href");
    link.setAttribute("href", `#${path}`);
    link.addEventListener("click", (event) => { event.preventDefault(); navigate(path); });
  });
  document.querySelectorAll("[data-home-section]").forEach((control) => control.addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector(`#${control.dataset.homeSection}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }));
  document.querySelectorAll("[data-hex-character]").forEach((button) => button.addEventListener("click", () => {
    const character = getCharacter(button.dataset.hexCharacter);
    document.querySelectorAll("[data-hex-character]").forEach((item) => item.classList.toggle("active", item === button));
    const profile = document.querySelector("#story-profile");
    profile.outerHTML = storyProfile(character);
    document.querySelector(".constellation").classList.add("profile-open");
    bindDynamicProfileControls();
  }));
  bindDynamicProfileControls();
  document.querySelectorAll("[data-back]").forEach((button) => button.addEventListener("click", () => history.length > 1 ? history.back() : navigate("/characters")));
  document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".character-card").forEach((card) => {
      const character = getCharacter(card.dataset.character);
      card.hidden = filter !== "All" && character.type !== filter;
    });
  }));
  document.querySelectorAll("[data-choice]").forEach((button) => button.addEventListener("click", () => {
    addUserMessage(button.textContent.replace(/^\d/, "").trim());
    const affection = document.querySelector("#affection-value");
    if (affection) affection.textContent = `${Number.parseInt(affection.textContent) + 4}%`;
  }));
  document.querySelector("#composer")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("#message-input");
    addUserMessage(input.value);
    input.value = "";
  });
  document.querySelector("#mature-toggle")?.addEventListener("change", (event) => {
    if (event.target.checked) {
      event.target.checked = false;
      openModal("mature");
    }
  });
  document.querySelector("[data-paywall]")?.addEventListener("click", () => openModal("paywall"));
  document.querySelector("[data-replay]")?.addEventListener("click", () => openModal("replay"));
  document.querySelector("[data-preview]")?.addEventListener("click", () => openModal("paywall", getCharacter(currentPath().split("/")[2])));
  document.querySelector("[data-hint]")?.addEventListener("click", (event) => {
    event.currentTarget.textContent = "Try being honest, not impressive.";
    event.currentTarget.classList.add("revealed");
  });
  document.querySelector("#login-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    navigate("/");
  });
  document.querySelector("[data-demo-login]")?.addEventListener("click", () => {
    document.querySelector("#login-email").value = "alex@ameet.demo";
    document.querySelector("#login-form").requestSubmit();
  });
  const codeDigits = [...document.querySelectorAll("[data-code-digit]")];
  codeDigits.forEach((input, index) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "").slice(-1);
      if (input.value && codeDigits[index + 1]) codeDigits[index + 1].focus();
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && !input.value && codeDigits[index - 1]) codeDigits[index - 1].focus();
    });
    input.addEventListener("paste", (event) => {
      const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
      if (!digits) return;
      event.preventDefault();
      digits.split("").forEach((digit, digitIndex) => { if (codeDigits[digitIndex]) codeDigits[digitIndex].value = digit; });
      codeDigits[Math.min(digits.length, 6) - 1]?.focus();
    });
  });
  document.querySelector("#invite-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = codeDigits.map((input) => input.value).join("");
    const feedback = document.querySelector("#invite-feedback");
    if (code.length !== 6) {
      feedback.textContent = "Please enter all 6 digits.";
      feedback.className = "invite-feedback error";
      return;
    }
    if (code !== "111111") {
      feedback.textContent = "That code isn’t valid. Try the demo code 111111.";
      feedback.className = "invite-feedback error";
      return;
    }
    feedback.textContent = "Invite accepted. Opening your story…";
    feedback.className = "invite-feedback success";
    sessionStorage.setItem("ameet-invite-access", "granted");
    setTimeout(() => {
      history.replaceState({}, "", "/#/");
      render();
    }, 500);
  });
}

function bindDynamicProfileControls() {
  document.querySelectorAll("#selected-character a[href^='/']").forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    navigate(link.getAttribute("href"));
  }));
  document.querySelectorAll("[data-open-profile]").forEach((button) => button.addEventListener("click", () => {
    const character = getCharacter(button.dataset.openProfile);
    const constellation = document.querySelector(".constellation");
    const profile = document.querySelector("#story-profile");
    profile.outerHTML = storyProfile(character);
    constellation.classList.add("profile-open");
    bindDynamicProfileControls();
  }));
  document.querySelector("[data-close-profile]")?.addEventListener("click", () => {
    document.querySelector(".constellation")?.classList.remove("profile-open");
  });
  document.querySelectorAll("#story-profile a[href^='/']").forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    navigate(link.getAttribute("href"));
  }));
}

window.addEventListener("popstate", render);
window.addEventListener("hashchange", render);
render();
