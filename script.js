const filterButtons = document.querySelectorAll(".filter-button");
const filmCards = document.querySelectorAll(".film-card");
const emptyState = document.querySelector(".empty-state");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach((filter) => {
      const isActive = filter === button;
      filter.classList.toggle("is-active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });

    filmCards.forEach((card) => {
      const isVisible = category === "all" || card.dataset.category === category;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    emptyState.hidden = visibleCount > 0;
  });
});

const detourButton = document.querySelector(".detour-button");
const detourMessage = document.querySelector(".detour-message");
let pickedStoryTimer;

detourButton.addEventListener("click", () => {
  const availableStories = [...filmCards].filter((card) => !card.hidden);
  if (availableStories.length === 0) return;

  const pickedStory = availableStories[Math.floor(Math.random() * availableStories.length)];
  const heading = pickedStory.querySelector("h3");
  const title = heading.querySelector(".text-reveal-word")
    ? [...heading.querySelectorAll(".text-reveal-word")].map((word) => word.textContent).join(" ")
    : heading.textContent.trim();

  window.clearTimeout(pickedStoryTimer);
  filmCards.forEach((card) => card.classList.remove("story-picked"));
  detourMessage.textContent = `Your next little adventure: ${title}`;
  pickedStory.classList.add("story-picked");
  pickedStory.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "center"
  });

  pickedStoryTimer = window.setTimeout(() => pickedStory.classList.remove("story-picked"), 3000);
});

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  siteNav.classList.toggle("is-open", !isExpanded);
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    siteNav.classList.remove("is-open");
  });
});

const videoDialog = document.querySelector(".video-dialog");
const videoFrame = document.querySelector(".video-frame");
const videoTitle = document.querySelector(".video-title");

function playVideo(videoId, title) {
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;
  iframe.title = title;
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;
  videoFrame.replaceChildren(iframe);
  videoTitle.textContent = title;
  videoDialog.showModal();
}

document.querySelectorAll(".js-play").forEach((button) => {
  button.addEventListener("click", () => {
    playVideo(button.dataset.video, button.dataset.title);
  });
});

function closeVideo() {
  videoDialog.close();
  videoFrame.replaceChildren();
}

document.querySelector(".modal-close").addEventListener("click", closeVideo);
videoDialog.addEventListener("click", (event) => {
  if (event.target === videoDialog) closeVideo();
});
videoDialog.addEventListener("close", () => videoFrame.replaceChildren());

document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const emailInput = form.querySelector('input[type="email"]');
  const message = form.querySelector(".form-message");

  if (!emailInput.reportValidity()) return;

  message.textContent = "This preview form isn't connected to a mailing list yet.";
});

document.querySelector("#current-year").textContent = new Date().getFullYear();

const YOUTUBE_HANDLE = "himanshuguptavloggs";
const YOUTUBE_CHANNEL_URL = `https://www.youtube.com/@${YOUTUBE_HANDLE}`;
const YOUTUBE_VIDEO_LIMIT = 20;
const YOUTUBE_CACHE_KEY = "youtube-videos-cache";
const YOUTUBE_REFRESH_INTERVAL_MS = 60 * 1000;
const YOUTUBE_API_ORIGIN = window.location.protocol === "file:" ? "http://localhost:3000" : window.location.origin;
const youtubeContainer = document.getElementById("youtube-videos");
const youtubeStatus = document.querySelector(".youtube-refresh-status");
const YOUTUBE_CATEGORY_KEYWORDS = {
  travel: [
    /travel/i, /trip/i, /mountain/i, /beach/i, /road/i, /adventure/i, /city/i, /country/i,
    /journey/i, /explore/i, /dolomite/i, /kyoto/i, /japan/i, /italy/i, /portugal/i,
    /flight/i, /vacation/i, /tour/i, /vlog/i
  ],
  "slow-living": [
    /slow/i, /home/i, /routine/i, /morning/i, /cafe/i, /coffee/i, /sunday/i, /weekend/i,
    /quiet/i, /rest/i, /family/i, /peace/i, /chill/i, /lifestyle/i
  ],
  "field-notes": [
    /note/i, /behind/i, /camera/i, /gear/i, /story/i, /journal/i, /field/i, /mini/i,
    /process/i, /setup/i, /make/i, /lesson/i, /learn/i, /diary/i
  ]
};

function updateYouTubeStatus(message) {
  if (!youtubeStatus) return;
  youtubeStatus.textContent = message;
}

function renderLoadingSkeleton() {
  if (!youtubeContainer) return;

  const skeletons = Array.from({ length: 3 }, (_, index) => {
    const card = document.createElement("article");
    card.className = "youtube-card youtube-card-skeleton";
    card.setAttribute("aria-hidden", "true");
    card.innerHTML = `
      <div class="youtube-skeleton youtube-skeleton-thumb"></div>
      <div class="youtube-skeleton youtube-skeleton-line youtube-skeleton-line-lg"></div>
      <div class="youtube-skeleton youtube-skeleton-line youtube-skeleton-line-sm"></div>
    `;
    return card;
  });

  youtubeContainer.replaceChildren(...skeletons);
}

function showYouTubeMessage(message) {
  if (!youtubeContainer) return;
  const status = document.createElement("p");
  status.className = "youtube-empty";
  status.setAttribute("role", "status");
  status.textContent = message;
  youtubeContainer.replaceChildren(status);
}

function readCachedYouTubeVideos() {
  try {
    const cached = localStorage.getItem(YOUTUBE_CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed;
  } catch (error) {
    console.warn("Could not read cached YouTube videos:", error);
    return null;
  }
}

function writeCachedYouTubeVideos(videos) {
  try {
    localStorage.setItem(YOUTUBE_CACHE_KEY, JSON.stringify(videos));
  } catch (error) {
    console.warn("Could not cache YouTube videos:", error);
  }
}

async function fetchYouTubeVideos() {
  if (!youtubeContainer) return;

  const cachedVideos = readCachedYouTubeVideos();
  if (cachedVideos) {
    renderVideos(cachedVideos);
  } else {
    renderLoadingSkeleton();
  }

  youtubeContainer.setAttribute("aria-busy", "true");
  updateYouTubeStatus("Updating latest videos…");

  try {
    const apiUrl = `${YOUTUBE_API_ORIGIN}/api/youtube?handle=${encodeURIComponent(YOUTUBE_HANDLE)}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Backend responded with HTTP ${response.status}.`);
    }

    const data = await response.json();
    const videos = Array.isArray(data.items) ? data.items.slice(0, YOUTUBE_VIDEO_LIMIT) : [];

    if (videos.length === 0) {
      showYouTubeMessage("No videos were found in this feed yet. Visit the channel for the latest uploads.");
      updateYouTubeStatus("No new videos yet");
      return;
    }

    writeCachedYouTubeVideos(videos);
    renderVideos(videos);
    const now = new Date();
    updateYouTubeStatus(`Updated ${now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`);
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    if (!cachedVideos) {
      showYouTubeMessage("The video feed couldn’t be loaded. Visit the YouTube channel to watch the latest videos.");
    }
    updateYouTubeStatus("Last update failed — retrying soon");
  } finally {
    youtubeContainer.setAttribute("aria-busy", "false");
  }
}

function getVideoId(item) {
  if (!item) return null;

  const candidates = [
    item.videoId,
    item.guid?.match(/(?:yt:video:|video:)([A-Za-z0-9_-]{11})/)?.[1],
    item.link?.match(/[?&]v=([A-Za-z0-9_-]{11})(?:[&#]|$)/i)?.[1],
    item.link?.match(/youtu\.be\/([A-Za-z0-9_-]{11})(?:[?#]|$)/i)?.[1]
  ];
  const videoId = candidates.find((candidate) => typeof candidate === "string" && /^[A-Za-z0-9_-]{11}$/.test(candidate));
  if (videoId) return videoId;
  return null;
}

function getVideoCategory(title) {
  const normalizedTitle = String(title || "");
  const categoryEntries = Object.entries(YOUTUBE_CATEGORY_KEYWORDS);
  for (const [category, patterns] of categoryEntries) {
    if (patterns.some((pattern) => pattern.test(normalizedTitle))) {
      return category;
    }
  }
  return "travel";
}

function renderVideos(items) {
  if (!youtubeContainer) return;

  const groupedVideos = {
    travel: [],
    "slow-living": [],
    "field-notes": []
  };

  items.forEach((item) => {
    const videoId = getVideoId(item);
    if (!videoId) return;

    const title = typeof item.title === "string" && item.title.trim() ? item.title.trim() : "YouTube video";
    const category = getVideoCategory(title);
    groupedVideos[category] = groupedVideos[category] || [];
    groupedVideos[category].push({ ...item, videoId, title });
  });

  const groups = Object.entries(groupedVideos)
    .filter(([, videos]) => videos.length > 0)
    .map(([category, videos]) => {
      const section = document.createElement("section");
      section.className = "youtube-category";

      const heading = document.createElement("h3");
      heading.className = "youtube-category-title";
      heading.textContent = category === "travel" ? "Travel" : category === "slow-living" ? "Slow living" : "Field notes";

      const grid = document.createElement("div");
      grid.className = "youtube-category-grid";

      videos.forEach((video) => {
        const card = document.createElement("article");
        card.className = "youtube-card";

        const button = document.createElement("button");
        button.className = "youtube-thumb";
        button.type = "button";
        button.dataset.video = video.videoId;
        button.dataset.title = video.title;
        button.setAttribute("aria-label", `Play ${video.title}`);

        const thumbnail = document.createElement("img");
        thumbnail.src = `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`;
        thumbnail.alt = "";
        thumbnail.loading = "lazy";
        thumbnail.onerror = () => {
          thumbnail.src = `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`;
          thumbnail.onerror = null;
        };

        const playIcon = document.createElement("span");
        playIcon.className = "play-button";
        playIcon.setAttribute("aria-hidden", "true");
        playIcon.textContent = "▶";
        button.append(thumbnail, playIcon);

        const headingText = document.createElement("h4");
        headingText.textContent = video.title;

        const link = document.createElement("a");
        link.className = "youtube-watch-link";
        link.href = `https://www.youtube.com/watch?v=${video.videoId}`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Watch on YouTube ↗";

        card.append(button, headingText, link);
        grid.append(card);
      });

      section.append(heading, grid);
      return section;
    });

  youtubeContainer.replaceChildren(...groups);
}

youtubeContainer?.addEventListener("click", (event) => {
  const button = event.target.closest(".youtube-thumb");
  if (!button || !youtubeContainer.contains(button)) return;
  playVideo(button.dataset.video, button.dataset.title);
});

fetchYouTubeVideos();
window.setInterval(fetchYouTubeVideos, YOUTUBE_REFRESH_INTERVAL_MS);

const textRevealTargets = document.querySelectorAll(
  ".intro-copy, .films h2, .film-card h3, .film-card > p, .about-content h2, .about-copy, .about-signoff > span:first-child, .journal h2, .journal-card h3, .journal-card > p, .newsletter h2, .newsletter-copy > p, .contact h2, .contact-side > p, .email-link"
);

textRevealTargets.forEach((element) => {
  const fullText = element.innerText.replace(/\s+/g, " ").trim();
  const textNodes = [];
  let wordIndex = 0;
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    if (walker.currentNode.textContent.trim()) textNodes.push(walker.currentNode);
  }

  textNodes.forEach((textNode) => {
    const fragment = document.createDocumentFragment();
    textNode.textContent.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        fragment.append(document.createTextNode(part));
        return;
      }

      const word = document.createElement("span");
      word.className = "text-reveal-word";
      word.setAttribute("aria-hidden", "true");
      word.textContent = part;
      word.style.setProperty("--word-index", wordIndex);
      wordIndex += 1;
      fragment.append(word);
    });
    textNode.replaceWith(fragment);
  });

  const accessibleText = document.createElement("span");
  accessibleText.className = "visually-hidden";
  accessibleText.textContent = fullText;
  element.append(accessibleText);
  element.classList.add("text-reveal");
});

const revealTargets = document.querySelectorAll(
  ".intro, .films .section-heading, .filters, .film-card, .about-photo, .about-content, .journal .section-heading, .journal-card, .newsletter-copy, .newsletter-form, .contact > div, .site-footer"
);

revealTargets.forEach((element, index) => {
  element.classList.add("scroll-reveal");
  const group = element.matches(".film-card") ? ".film-card" : ".journal-card";
  if (element.matches(group)) {
    const siblings = [...element.parentElement.querySelectorAll(group)];
    element.style.setProperty("--reveal-delay", `${(siblings.indexOf(element) % 3) * 90}ms`);
  } else {
    element.style.setProperty("--reveal-delay", `${Math.min(index % 3, 2) * 60}ms`);
  }
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  revealTargets.forEach((element) => revealObserver.observe(element));

  const textObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("text-is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -35px 0px" });

  textRevealTargets.forEach((element) => textObserver.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
  textRevealTargets.forEach((element) => element.classList.add("text-is-visible"));
}

document.documentElement.classList.add("motion-ready");

let scrollTicking = false;
window.addEventListener("scroll", () => {
  if (scrollTicking) return;
  scrollTicking = true;
  window.requestAnimationFrame(() => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    document.documentElement.style.setProperty("--scroll-progress", `${progress}%`);
    scrollTicking = false;
  });
}, { passive: true });

const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (finePointer.matches && !reducedMotion.matches) {
  const hero = document.querySelector(".hero");
  let pointerFrame = 0;

  hero.addEventListener("pointermove", (event) => {
    if (pointerFrame) return;

    pointerFrame = window.requestAnimationFrame(() => {
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      hero.style.setProperty("--hero-rotate-x", `${(-y * 2.4).toFixed(2)}deg`);
      hero.style.setProperty("--hero-rotate-y", `${(x * 3.2).toFixed(2)}deg`);
      hero.style.setProperty("--hero-x", `${(x * 13).toFixed(1)}px`);
      hero.style.setProperty("--hero-y", `${(y * 10).toFixed(1)}px`);
      hero.style.setProperty("--light-x", `${(event.clientX - bounds.left).toFixed(0)}px`);
      hero.style.setProperty("--light-y", `${(event.clientY - bounds.top).toFixed(0)}px`);
      pointerFrame = 0;
    });
  });

  hero.addEventListener("pointerleave", () => {
    if (pointerFrame) {
      window.cancelAnimationFrame(pointerFrame);
      pointerFrame = 0;
    }
    hero.style.setProperty("--hero-rotate-x", "0deg");
    hero.style.setProperty("--hero-rotate-y", "0deg");
    hero.style.setProperty("--hero-x", "0px");
    hero.style.setProperty("--hero-y", "0px");
  });

  document.querySelectorAll(".film-card, .journal-card").forEach((card) => {
    let cardFrame = 0;

    card.addEventListener("pointermove", (event) => {
      if (cardFrame) return;

      cardFrame = window.requestAnimationFrame(() => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;

        card.style.setProperty("--tilt-x", `${((0.5 - y) * 5).toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${((x - 0.5) * 6).toFixed(2)}deg`);
        card.style.setProperty("--light-x", `${(x * 100).toFixed(1)}%`);
        card.style.setProperty("--light-y", `${(y * 100).toFixed(1)}%`);
        cardFrame = 0;
      });
    });

    card.addEventListener("pointerleave", () => {
      if (cardFrame) {
        window.cancelAnimationFrame(cardFrame);
        cardFrame = 0;
      }
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}
