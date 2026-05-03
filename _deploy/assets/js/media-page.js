const MEDIA_PAGE_DATA = {
  en: {
    pageTitle: "Media & Events | AHALGOSAIBI Group",
    eyebrow: "Media & Events",
    title: "Updates from the Group",
    summary:
      "This page will feature the group's latest Instagram posts, announcements, and event highlights as soon as content is published.",
    status: "Coming soon",
    overviewTitle: "What Will Appear Here",
    overviewCopy: [
      "This page is being prepared as the central place for media coverage across the group.",
      "Once the Instagram feed is connected and the account starts publishing, new posts will appear here automatically alongside short context for announcements and event coverage."
    ],
    feedTitle: "Latest Feed",
    back: "Back to Home",
    pageType: "Media & Events",
    home: "Home",
    companies: "Companies",
    contact: "Contact",
    contactAction: "Contact Group",
    companiesAction: "All Companies",
    otherLanguage: "AR",
    otherLanguageLabel: "Arabic",
    footer: "© 2026 Ahmad Hamad Al-Gosaibi & Bros. Co. All rights reserved.",
    top: "Back to top",
    metaItems: [
      ["Status", "Ready for future Instagram integration"],
      ["Source", "Official Instagram account"],
      ["Coverage", "Announcements, events, and milestones"]
    ],
    emptyTitle: "No posts published yet",
    emptyBody:
      "The page is ready to display the group's Instagram posts, but there is no published content to show yet.",
    emptyHint: "Check back soon for the first updates.",
    placeholderCards: [
      {
        title: "Announcements",
        body: "Corporate updates, business milestones, and public notices will be highlighted here."
      },
      {
        title: "Events",
        body: "Future exhibitions, meetings, and event highlights will appear in this feed."
      },
      {
        title: "Instagram Posts",
        body: "Once publishing begins, official Instagram content will be pulled into this page automatically."
      }
    ],
    viewPost: "View post"
  },
  ar: {
    pageTitle: "الإعلام والفعاليات | مجموعة القصيبي",
    eyebrow: "الإعلام والفعاليات",
    title: "آخر التحديثات من المجموعة",
    summary:
      "ستعرض هذه الصفحة أحدث منشورات إنستغرام والإعلانات وأبرز الفعاليات فور توفر المحتوى.",
    status: "قريبًا",
    overviewTitle: "ماذا سيظهر هنا",
    overviewCopy: [
      "يجري تجهيز هذه الصفحة لتكون المساحة المركزية لتغطية أخبار المجموعة وفعالياتها.",
      "بمجرد ربط خلاصة إنستغرام وبدء النشر، ستظهر المنشورات هنا تلقائيًا مع نبذة مختصرة عن الإعلانات والفعاليات."
    ],
    feedTitle: "آخر المنشورات",
    back: "العودة للرئيسية",
    pageType: "الإعلام والفعاليات",
    home: "الرئيسية",
    companies: "الشركات",
    contact: "اتصل بنا",
    contactAction: "تواصل مع المجموعة",
    companiesAction: "جميع الشركات",
    otherLanguage: "EN",
    otherLanguageLabel: "English",
    footer: "© 2026 أحمد حمد القصيبي وإخوانه. جميع الحقوق محفوظة.",
    top: "العودة للأعلى",
    metaItems: [
      ["الحالة", "الصفحة جاهزة وتنتظر أول المنشورات"],
      ["المصدر", "حساب إنستغرام الرسمي"],
      ["المحتوى", "الإعلانات والفعاليات والإنجازات"]
    ],
    emptyTitle: "لا توجد منشورات حتى الآن",
    emptyBody:
      "الصفحة جاهزة لعرض منشورات إنستغرام الخاصة بالمجموعة، ولكن لا توجد مواد منشورة في الوقت الحالي.",
    emptyHint: "يرجى العودة لاحقًا للاطلاع على أول التحديثات.",
    placeholderCards: [
      {
        title: "الإعلانات",
        body: "ستظهر هنا تحديثات المجموعة والإنجازات والإعلانات العامة."
      },
      {
        title: "الفعاليات",
        body: "ستعرض الصفحة لاحقًا أبرز الاجتماعات والمعارض والأنشطة الخاصة بالمجموعة."
      },
      {
        title: "منشورات إنستغرام",
        body: "عند بدء النشر، سيتم عرض المحتوى الرسمي من إنستغرام في هذه الصفحة تلقائيًا."
      }
    ],
    viewPost: "عرض المنشور"
  }
};

async function fetchInstagramPosts() {
  return Array.isArray(window.MEDIA_FEED) ? window.MEDIA_FEED : [];
}

function renderFeed(feedElement, posts, data) {
  if (!posts.length) {
    feedElement.innerHTML = `
      <article class="media-empty">
        <span class="status-pill">${data.status}</span>
        <h3>${data.emptyTitle}</h3>
        <p>${data.emptyBody}</p>
        <p>${data.emptyHint}</p>
      </article>
      ${data.placeholderCards
        .map(
          (card) => `
            <article class="media-card">
              <h3>${card.title}</h3>
              <p>${card.body}</p>
            </article>
          `
        )
        .join("")}
    `;
    return;
  }

  feedElement.innerHTML = posts
    .map(
      (post) => `
        <article class="media-card">
          <h3>${post.title || data.eyebrow}</h3>
          <p>${post.caption || ""}</p>
          ${post.link ? `<a class="back-link" href="${post.link}" target="_blank" rel="noreferrer">${data.viewPost}</a>` : ""}
        </article>
      `
    )
    .join("");
}

async function renderMediaPage() {
  const lang = document.body.dataset.lang || "en";
  const data = MEDIA_PAGE_DATA[lang];

  document.getElementById("pageTitle").textContent = data.pageTitle;
  document.getElementById("mediaEyebrow").textContent = data.eyebrow;
  document.getElementById("mediaTitle").textContent = data.title;
  document.getElementById("mediaSummary").textContent = data.summary;
  document.getElementById("mediaStatus").textContent = data.status;
  document.getElementById("overviewTitle").textContent = data.overviewTitle;
  document.getElementById("feedTitle").textContent = data.feedTitle;
  document.getElementById("backHomeLabel").textContent = data.back;
  document.getElementById("pageTypeLabel").textContent = data.pageType;
  document.getElementById("homeNavLabel").textContent = data.home;
  document.getElementById("companiesNavLabel").textContent = data.companies;
  document.getElementById("contactNavLabel").textContent = data.contact;
  document.getElementById("contactActionLabel").textContent = data.contactAction;
  document.getElementById("companiesActionLabel").textContent = data.companiesAction;
  document.getElementById("langSwitchLabel").textContent = data.otherLanguage;
  document.getElementById("langSwitchLabel").setAttribute("aria-label", data.otherLanguageLabel);

  const footerCopy = document.querySelector(".site-footer p");
  if (footerCopy) {
    footerCopy.textContent = data.footer;
  }

  const footerLink = document.querySelector(".site-footer a");
  if (footerLink) {
    footerLink.textContent = data.top;
  }

  const meta = document.getElementById("mediaMeta");
  meta.innerHTML = data.metaItems
    .map(
      ([label, value]) =>
        `<div class="detail-meta-item"><span>${label}</span><strong>${value}</strong></div>`
    )
    .join("");

  const mediaCopy = document.getElementById("mediaCopy");
  mediaCopy.innerHTML = data.overviewCopy.map((paragraph) => `<p>${paragraph}</p>`).join("");

  const posts = await fetchInstagramPosts();
  renderFeed(document.getElementById("instagramFeed"), posts, data);
}

renderMediaPage();
