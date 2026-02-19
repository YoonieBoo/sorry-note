/* =========================================================
   SHARED HELPERS
========================================================= */
function scrollToBottom(chatBody) {
  if (!chatBody) return;
  chatBody.scrollTop = chatBody.scrollHeight;
}

function addBubble(chatBody, side, color, text, extraClass = "") {
  const row = document.createElement("div");
  row.className = `bubble-row ${side} fade-in`;

  const bubble = document.createElement("div");
  bubble.className = `bubble ${color} ${extraClass}`.trim();
  bubble.textContent = text;

  row.appendChild(bubble);
  chatBody.appendChild(row);
  scrollToBottom(chatBody);
}

/* =========================================================
   PAGE 1: index.html (Notification -> chat -> type YES -> go yes.html)
========================================================= */
(function initIndexFlow() {
  const notifyStage = document.getElementById("notifyStage");
  const notifyCard = document.getElementById("notifyCard");
  const letterStage = document.getElementById("letterStage");

  // If no notification elements, we are not on index.html
  if (!notifyStage || !notifyCard || !letterStage) return;

  const chatBody = document.getElementById("chatBody");
  const input = document.getElementById("msgInput");
  const sendBtn = document.getElementById("sendBtn");
  const typingRow = document.getElementById("typingRow");
  const hintLine = document.getElementById("hintLine");

  let done = false;

  notifyCard.addEventListener("click", () => {
  notifyStage.classList.add("fade");

  setTimeout(() => {
    notifyStage.classList.add("hidden");
    letterStage.classList.remove("hidden");
    letterStage.classList.add("show");

    const initial = document.getElementById("initialMessages");
    const messages = initial.querySelectorAll(".bubble-row");

    initial.classList.remove("hidden");

    messages.forEach((msg, index) => {
      msg.style.opacity = "0";
      msg.style.transform = "translateY(10px)";

      setTimeout(() => {
        msg.style.transition = "all 0.25s ease";
        msg.style.opacity = "1";
        msg.style.transform = "translateY(0)";
        scrollToBottom(chatBody);
      }, index * 200); // 0.2s apart
    });

    input.focus();
  }, 500);
});


  function handleSend() {
    if (done) return;
    const val = input.value.trim();
    if (!val) return;

    if (val.toLowerCase() !== "yes") {
      input.value = "";
      hintLine.innerHTML = 'Type <b>yes</b> only pleaseeeeee 😭';
      setTimeout(() => {
        hintLine.innerHTML = 'Type <b>yes</b> and press Send pleaseeeeeee.';
      }, 1200);
      return;
    }

    input.value = "";
    input.disabled = true;
    sendBtn.disabled = true;
    done = true;

    // show typing briefly then add blue bubble then redirect
    typingRow.classList.remove("hidden");
    scrollToBottom(chatBody);

    setTimeout(() => {
      typingRow.classList.add("hidden");
      addBubble(chatBody, "right", "blue", val);
      setTimeout(() => {
        window.location.href = "yes.html";
      }, 700);
    }, 900);
  }

  sendBtn.addEventListener("click", handleSend);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSend();
  });
})();

/* =========================================================
   PAGE 2: yes.html (GIF + question -> type YES -> i love u under it -> celebration)
========================================================= */
(function initYesFlow() {
  const celebrationContainer = document.getElementById("celebration");
  const chatBody = document.getElementById("chatBody");
  const input = document.getElementById("msgInput");
  const sendBtn = document.getElementById("sendBtn");
  const hintLine = document.getElementById("hintLine");
  const typingRow = document.getElementById("typingRow");
  const chatWrapper = document.querySelector(".chat-wrapper");

  // If no celebration container, we are not on yes.html
  if (!celebrationContainer || !chatBody || !input || !sendBtn || !hintLine) return;

  let done = false;

  function triggerCelebration() {
    if (chatWrapper) {
      chatWrapper.classList.add("chat-pulse");
      setTimeout(() => chatWrapper.classList.remove("chat-pulse"), 800);
    }

    // Hearts
    for (let i = 0; i < 20; i++) {
      const heart = document.createElement("div");
      heart.className = "heart-float";
      heart.textContent = "💖";
      heart.style.left = Math.random() * 100 + "%";
      heart.style.fontSize = (14 + Math.random() * 16) + "px";
      heart.style.animationDuration = (3.6 + Math.random() * 1.2) + "s";
      celebrationContainer.appendChild(heart);
      setTimeout(() => heart.remove(), 4200);
    }

    // Confetti
    const colors = ["#ff6b81", "#feca57", "#1dd1a1", "#54a0ff", "#ff9ff3"];
    for (let i = 0; i < 40; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = Math.random() * 100 + "%";
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = (2 + Math.random() * 2) + "s";
      celebrationContainer.appendChild(piece);
      setTimeout(() => piece.remove(), 3200);
    }
  }

  function handleSend() {
    if (done) return;
    const val = input.value.trim();
    if (!val) return;

    if (val.toLowerCase() !== "yes") {
      input.value = "";
      hintLine.innerHTML = 'Type <b>yes</b> only 🙂';
      setTimeout(() => {
        hintLine.innerHTML = 'Type <b>yes</b> and press Send.';
      }, 1200);
      return;
    }

    // optional: show typing dots briefly
    if (typingRow) {
      typingRow.classList.remove("hidden");
      scrollToBottom(chatBody);
    }

    input.value = "";
    input.disabled = true;
    sendBtn.disabled = true;
    done = true;

    setTimeout(() => {
      if (typingRow) typingRow.classList.add("hidden");

      // Message 3: his typed yes as blue
      addBubble(chatBody, "right", "blue", val);

      // Message 4: grey i love u UNDER the blue yes
      setTimeout(() => {
        addBubble(chatBody, "left", "gray", "yayyy i love u");
        setTimeout(() => triggerCelebration(), 450);
      }, 600);
    }, 650);
  }

  sendBtn.addEventListener("click", handleSend);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSend();
  });

  scrollToBottom(chatBody);
})();
