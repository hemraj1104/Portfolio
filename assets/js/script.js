'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

formInputs.forEach(input => {
  input.addEventListener("input", () => {
    const allFilled = Array.from(formInputs).every(i => i.value.trim() !== "");
    formBtn.disabled = !allFilled;
  });
});

form.addEventListener("submit", () => {
  formBtn.innerHTML = "<span>Sending...</span>";
});



// ================= PAGE NAVIGATION =================
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    // 1. Get the text from the button, make it lowercase, and remove spaces
    const targetPage = this.innerHTML.toLowerCase().trim();

    // 2. Loop through pages to find the match
    for (let j = 0; j < pages.length; j++) {
      if (targetPage === pages[j].dataset.page) {
        pages[j].classList.add("active");
        navigationLinks[j].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[j].classList.remove("active");
        navigationLinks[j].classList.remove("active");
      }
    }
  });
}

// =========================
// GITHUB ACTIVITY - SMALL DYNAMIC GRID
// =========================

async function loadGitHubActivity() {
    const username = "hemraj1104"; 
    const container = document.getElementById("github-activity");
    const tooltip = document.getElementById("github-tooltip");
    const usernameDisplay = document.querySelector(".github-username-display");
    const activityCountDisplay = document.querySelector(".github-activity-count");
    const currentMonthDisplay = document.querySelector(".github-current-month");

    // Exit if any element is missing
    if (!container || !usernameDisplay || !activityCountDisplay || !currentMonthDisplay) {
        console.warn("GitHub display elements not found in HTML.");
        return;
    }
    
    // Set fallback text while loading
    usernameDisplay.textContent = `@${username}`;
    activityCountDisplay.textContent = `Loading activities...`;
    currentMonthDisplay.textContent = `...`;

    try {
        // Trying a different API URL that is sometimes less blocked
        const res = await fetch(`https://api.github.com/users/${username}/events/public`);
        
        if (!res.ok) {
            throw new Error(`Failed to fetch public events from GitHub. Status: ${res.status}`);
        }

        // IMPORTANT: The official API doesn't give a heatmap. 
        // We MUST use the jogruber API for the heatmap squares.

        const heatmapRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
        if (!heatmapRes.ok) {
            throw new Error(`Failed to fetch heatmap data from jogruber.de. Status: ${heatmapRes.status}`);
        }
        const data = await heatmapRes.json();


        // --- Populate Header ---
        activityCountDisplay.textContent = `${data.totalContributions} activities in ${new Date().getFullYear()}`;
        
        // Get current month name
        const now = new Date();
        const currentMonthName = now.toLocaleString('en-US', { month: 'short' });
        currentMonthDisplay.textContent = currentMonthName;


        // --- Draw Heatmap Grid (Only Last 35 Days) ---
        container.innerHTML = ""; 

        const allDays = [];
        data.weeks.forEach(week => week.contributionDays.forEach(day => allDays.push(day)));

        // Display ONLY the last 5 weeks (approx 35 days) to fit the small card
        const recentDays = allDays.slice(-35); 

        recentDays.forEach(day => {
            const div = document.createElement("div");
            div.classList.add("github-square");
            div.dataset.level = day.level; // 0-4

            // Add tooltip logic (requires the CSS from earlier turns)
            if (tooltip) {
                div.addEventListener("mouseenter", (e) => {
                    const d = new Date(day.date);
                    const formattedDate = d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
                    tooltip.innerHTML = `<strong>${day.contributionCount} contributions</strong><br>on ${formattedDate}`;
                    tooltip.style.opacity = 1;
                });
                div.addEventListener("mousemove", (e) => {
                    tooltip.style.left = e.pageX + 10 + "px";
                    tooltip.style.top = e.pageY - 30 + "px";
                });
                div.addEventListener("mouseleave", () => {
                    tooltip.style.opacity = 0;
                });
            } else {
                div.title = `${day.contributionCount} contributions on ${day.date}`;
            }
            
            container.appendChild(div);
        });

    } catch (err) {
        console.error("GitHub Activity Load Error:", err);
        activityCountDisplay.textContent = `Error loading data.`;
        currentMonthDisplay.textContent = `(Check console)`;
        container.innerHTML = ""; 
    }
}

loadGitHubActivity();