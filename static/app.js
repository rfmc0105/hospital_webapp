const translations = {
  en: {
    service:"Visitor information", eyebrow:"TOKYO METROPOLITAN HOSPITAL ORGANIZATION",
    heroTitle:"How can we help<br>you today?", heroDescription:"Find practical information about appointments, outpatient visits, departments and getting here.",
    official:"Visit official hospital website", bilingual:"Japanese · English",
    chatTitle:"Hospital information assistant", chatSubtitle:"Ask a question to get started", online:"Online", now:"Just now",
    suggestions:"SUGGESTED QUESTIONS", suggestAppointment:"How do I make an appointment?",
    suggestHours:"What are the reception hours?", suggestAccess:"How do I get there?",
    suggestReferral:"Do I need a referral letter?", placeholder:"Type your question here...",
    chatFootnote:"This assistant provides general visitor information, not medical advice.",
    appointments:"APPOINTMENTS", appointmentHours:"Weekdays, 9:00 a.m.–5:00 p.m.",
    callAppointment:"Call appointment desk", location:"LOCATION",
    hospitalName:"Tokyo Metropolitan Ohtsuka Hospital", address:"2-8-1 Minamiotsuka, Toshima-ku, Tokyo 170-8476",
    directions:"Directions and access", emergencyTitle:"Emergency information",
    emergencyText:"Emergency visits are accepted 24 hours. Please call the hospital before coming.",
    departmentsTitle:"Medical departments", departmentsText:"Check the hospital's departments and specialties.",
    outpatientTitle:"Outpatient guide", outpatientText:"Read first-visit and returning-patient procedures.",
    learnMore:"Learn more ↗", disclaimer:"Not an official hospital service. Confirm details with the hospital.",
    welcome:"Hello! I can help you find hospital information. What would you like to know?",
    error:"Sorry, I could not connect to the information service. Please try again.",
    you:"You", assistant:"Hospital assistant"
  },
  ja: {
    service:"来院者向け案内", eyebrow:"東京都立病院機構",
    heroTitle:"本日はどのような<br>ご用件でしょうか？", heroDescription:"予約、外来受診、診療科、交通アクセスなどの情報をご案内します。",
    official:"病院公式サイトを見る", bilingual:"日本語 · English",
    chatTitle:"病院案内アシスタント", chatSubtitle:"質問を入力してください", online:"利用可能", now:"たった今",
    suggestions:"よくある質問", suggestAppointment:"予約方法を教えてください",
    suggestHours:"受付時間を教えてください", suggestAccess:"病院への行き方を教えてください",
    suggestReferral:"紹介状は必要ですか？", placeholder:"質問を入力してください…",
    chatFootnote:"一般的な来院案内を提供するもので、医療上の助言ではありません。",
    appointments:"予約", appointmentHours:"平日 9:00～17:00",
    callAppointment:"予約専用窓口へ電話", location:"所在地",
    hospitalName:"東京都立大塚病院", address:"〒170-8476 東京都豊島区南大塚2-8-1",
    directions:"交通アクセス", emergencyTitle:"救急受診について",
    emergencyText:"救急受診は24時間受け付けています。来院前に病院へお電話ください。",
    departmentsTitle:"診療科・部門", departmentsText:"診療科や専門分野をご確認いただけます。",
    outpatientTitle:"外来受診のご案内", outpatientText:"初診・再診の手続きについてご確認ください。",
    learnMore:"詳しく見る ↗", disclaimer:"病院公式サービスではありません。最新情報は病院へご確認ください。",
    welcome:"こんにちは。病院に関する情報をご案内します。どのようなことをお知りになりたいですか？",
    error:"情報サービスに接続できませんでした。もう一度お試しください。",
    you:"あなた", assistant:"病院案内アシスタント"
  }
};

let currentLanguage = "en";
const messages = document.getElementById("chat-messages");
const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");

function applyLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (translations[language][key]) el.innerHTML = translations[language][key];
  });
  document.querySelectorAll(".lang-btn").forEach(btn =>
    btn.classList.toggle("active", btn.dataset.lang === language)
  );
  input.placeholder = translations[language].placeholder;
  document.getElementById("welcome-message").textContent = translations[language].welcome;
}

function addMessage(text, sender) {
  const row = document.createElement("div");
  row.className = `message ${sender}`;
  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = sender === "assistant" ? "＋" : "●";
  const body = document.createElement("div");
  body.className = "message-body";
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  const time = document.createElement("span");
  time.className = "message-time";
  time.textContent = translations[currentLanguage].now;
  body.append(bubble, time);
  row.append(avatar, body);
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}

async function sendMessage(message) {
  const clean = message.trim();
  if (!clean) return;
  addMessage(clean, "user");
  input.value = "";
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({message: clean, language: currentLanguage})
    });
    if (!response.ok) throw new Error("Request failed");
    const data = await response.json();
    addMessage(data.answer, "assistant");
  } catch (error) {
    addMessage(translations[currentLanguage].error, "assistant");
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();
  sendMessage(input.value);
});

document.querySelectorAll(".lang-btn").forEach(btn =>
  btn.addEventListener("click", () => applyLanguage(btn.dataset.lang))
);

const suggestedQuestions = {
  en: {
    appointment:"How do I make an appointment?",
    hours:"What are the reception hours?",
    access:"How do I get to the hospital?",
    referral:"Do I need a referral letter?"
  },
  ja: {
    appointment:"予約方法を教えてください",
    hours:"受付時間を教えてください",
    access:"病院への行き方を教えてください",
    referral:"紹介状は必要ですか？"
  }
};

document.querySelectorAll(".suggestion").forEach(button => {
  button.addEventListener("click", () =>
    sendMessage(suggestedQuestions[currentLanguage][button.dataset.question])
  );
});

applyLanguage("en");
