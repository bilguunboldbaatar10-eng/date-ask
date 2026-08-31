// Elements
const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".btn[alt='Yes']");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");
const chosenActivitySpan = document.getElementById("chosen-activity");

// Calendar elements
const calendarContainer = document.getElementById("calendar-container");
const calMonthLabel = document.getElementById("calMonthLabel");
const daysGrid = document.getElementById("daysGrid");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const confirmDateBtn = document.getElementById("confirmDate");
const chosenDateSpan = document.getElementById("chosen-date");

// Activity options elements
const activityOptions = document.getElementById("activity-options");
const optionButtons = document.querySelectorAll(".option-btn");

// Click Envelope

envelope.addEventListener("click", () => {
    envelope.style.display = "none";
    letter.style.display = "flex";

    setTimeout( () => {
        document.querySelector(".letter-window").classList.add("open");
    },50);
});

// Logic to move the NO btn

noBtn.addEventListener("mouseover", () => {
    const min = 200;
    const max = 200;

    const distance = Math.random() * (max - min) + min;
    const angle = Math.random() * Math.PI * 2;

    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;

    noBtn.style.transition = "transform 0.3s ease";
    noBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

// ---------- Calendar logic ----------

const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const today = new Date();
let viewYear = today.getFullYear();
let viewMonth = today.getMonth();
let selectedDate = null;

function renderCalendar(year, month){
  calMonthLabel.textContent = `${monthNames[month]} ${year}`;
  daysGrid.innerHTML = "";

  const firstDay = new Date(year, month, 1);
  let startIdx = (firstDay.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < startIdx; i++) {
    const empty = document.createElement("button");
    empty.className = "empty";
    empty.disabled = true;
    daysGrid.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const btn = document.createElement("button");
    btn.textContent = d;
    const cellDate = new Date(year, month, d);
    const isPast = cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (isPast) btn.disabled = true;
    if (selectedDate && selectedDate.getTime() === cellDate.getTime()) {
      btn.classList.add("selected");
    }
    btn.addEventListener("click", () => {
      selectedDate = cellDate;
      renderCalendar(year, month);
      confirmDateBtn.disabled = false;
    });
    daysGrid.appendChild(btn);
  }

  prevMonthBtn.disabled = (year === today.getFullYear() && month === today.getMonth());
}

prevMonthBtn.addEventListener("click", () => {
  viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; }
  renderCalendar(viewYear, viewMonth);
});
nextMonthBtn.addEventListener("click", () => {
  viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; }
  renderCalendar(viewYear, viewMonth);
});

// Confirm Date -> instead of jumping straight to the final text,
// ask what to do that day (3 options)
confirmDateBtn.addEventListener("click", () => {
  calendarContainer.style.display = "none";
  activityOptions.style.display = "block";
});

// YES is clicked — shows the calendar
yesBtn.addEventListener("click", () => {
  buttons.style.display = "none";
  calendarContainer.style.display = "block";
  renderCalendar(viewYear, viewMonth);
});

// One of the 3 activity options is clicked -> reveal the final screen
optionButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    activityOptions.style.display = "none";

    title.textContent = "сонгож дууссан бол энийг screenshot хийгээд над руу явуулаарай";
    catImg.src = "cat_dance.gif";
    document.querySelector(".letter-window").classList.add("final");

    const dateStr = selectedDate.toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });
    chosenDateSpan.textContent = dateStr;
    chosenActivitySpan.textContent = btn.dataset.activity;
    finalText.style.display = "block";
  });
});
