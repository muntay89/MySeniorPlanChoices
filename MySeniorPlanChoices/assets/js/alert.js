document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const checkbox = document.getElementById("agree");
  const checkboxAlert = document.getElementById("checkbox-alert");
  const fieldAlert = document.getElementById("field-alert");

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");

  const messageDiv = document.getElementById("form-message");

  function showSuccessMessage(text) {
    messageDiv.innerHTML = text;
    messageDiv.style.display = "block";
    messageDiv.style.background = "#d4edda";
    messageDiv.style.color = "#155724";
    messageDiv.style.padding = "10px";
    messageDiv.style.borderRadius = "5px";
  }

  function showErrorMessage(text) {
    messageDiv.innerHTML = text;
    messageDiv.style.display = "block";
    messageDiv.style.background = "#f8d7da";
    messageDiv.style.color = "#721c24";
    messageDiv.style.padding = "10px";
    messageDiv.style.borderRadius = "5px";
  }

  function validateContactForm() {
    let valid = true;

    // checkbox validation
    if (!checkbox.checked) {
      valid = false;
      checkboxAlert.style.display = "block";
    } else {
      checkboxAlert.style.display = "none";
    }

    // required fields validation
    if (nameInput.value.trim() === "" || emailInput.value.trim() === "") {
      valid = false;
      fieldAlert.style.display = "block";
    } else {
      fieldAlert.style.display = "none";
    }

    return valid;
  }

  // Optional: auto-hide alerts as user fixes things
  checkbox.addEventListener("change", validateContactForm);
  nameInput.addEventListener("input", validateContactForm);
  emailInput.addEventListener("input", validateContactForm);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Hide previous message on each submit attempt
    if (messageDiv) messageDiv.style.display = "none";

    // ✅ Only send if valid
    if (!validateContactForm()) return;

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData
      });

      const text = await response.text();

      // If your PHP returns a ✅ on success, treat that as success
      // Otherwise, you can switch this to: if (response.ok) ...
      if (response.ok && text.includes("✅")) {
        showSuccessMessage(text);
        form.reset();
        checkboxAlert.style.display = "none";
        fieldAlert.style.display = "none";
      } else {
        // Show server message but style as error
        showErrorMessage(text || "❌ Message could not be sent.");
      }
    } catch (error) {
      showErrorMessage("❌ There was an error sending your message.");
    }
  });
});

function showBook() {
  document.getElementById("booking").classList.add("show");
}
function hideBook() {
  document.getElementById("booking").classList.remove("show");
}
function showBookInfo() {
  document.getElementById("booking-info").classList.add("show");
}
function hideBookInfo() {
  document.getElementById("booking-info").classList.remove("show");
}

const timeframesByDay = {
  0: [], // Sunday (closed)
  1: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM"], // Monday
  2: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM"], // Tuesday
  3: ["12:00 PM", "1:00 PM", "2:00 PM"],            // Wednesday
  4: ["9:00 AM", "10:00 AM", "11:00 AM"],            // Thursday
  5: ["1:00 PM", "2:00 PM", "3:00 PM"],              // Friday
  6: ["10:00 AM", "11:00 AM"]                         // Saturday
};

document.addEventListener("DOMContentLoaded", () => {
  const timeSelect = document.querySelector(".calendar-timeframes");

  const bookName = document.getElementById("booking-name");
  const bookEmail = document.getElementById("booking-email");
  const bookPhone = document.getElementById("booking-subject");

  const bookBtn = document.getElementById("book-submit");
  const msg = document.getElementById("booking-message");

  let selectedYMD = "";

  if (!timeSelect || !bookName || !bookEmail || !bookPhone || !bookBtn || !msg) {
    console.error("Booking elements missing:", {
      timeSelect, bookName, bookEmail, bookPhone, bookBtn, msg
    });
    return;
  }

  function setMsg(text, ok) {
    msg.textContent = text;
    msg.style.display = "block";
    msg.style.width = "60%";
    msg.style.margin = "0 auto 1.5em auto";
    msg.style.padding = "10px";
    msg.style.borderRadius = "6px";
    msg.style.background = ok ? "#d4edda" : "#f8d7da";
    msg.style.color = ok ? "#155724" : "#721c24";
  }

  function clearMsg() {
    msg.style.display = "none";
    msg.textContent = "";
  }

  function setSelectUnavailable() {
    timeSelect.innerHTML = "";
    const opt = document.createElement("option");
    opt.textContent = "Unavailable";
    opt.disabled = true;
    opt.selected = true;
    timeSelect.appendChild(opt);
  }

  function formatTime(t) {
    const [hh, mm] = t.split(":");
    let h = parseInt(hh, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${mm} ${ampm}`;
  }

  async function loadAvailableTimes(ymd) {
    clearMsg();
    timeSelect.innerHTML = "";

    const loading = document.createElement("option");
    loading.textContent = "Loading...";
    loading.disabled = true;
    loading.selected = true;
    timeSelect.appendChild(loading);

    try {
      const res = await fetch(`available.php?date=${encodeURIComponent(ymd)}`, {
        cache: "no-store"
      });
      const data = await res.json();

      timeSelect.innerHTML = "";

      if (!data.available || data.available.length === 0) {
        setSelectUnavailable();
        return;
      }

      data.available.forEach((t, i) => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = formatTime(t);
        if (i === 0) opt.selected = true;
        timeSelect.appendChild(opt);
      });
    } catch (e) {
      timeSelect.innerHTML = "";
      setSelectUnavailable();
      setMsg("Could not load availability. Try again.", false);
    }
  }

  flatpickr("#calendar", {
    inline: true,
    minDate: "today",
    dateFormat: "Y-m-d",
    onChange: (selectedDates, dateStr) => {
      if (!selectedDates.length) return;
      selectedYMD = dateStr;
      document.getElementById('booking-date').innerHTML = selectedYMD
      loadAvailableTimes(selectedYMD);
    }
  });


  bookBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    clearMsg();

    const name = bookName.value.trim();
    const email = bookEmail.value.trim();
    const phone = bookPhone.value.trim();
    const time = timeSelect.value;

    if (!selectedYMD) return setMsg("Please select a date first.", false);
    if (!time || time === "Unavailable" || time === "Loading...") return setMsg("Please select an available time.", false);
    if (!name || !email || !phone) return setMsg("Please fill in name, email, and phone.", false);

    bookBtn.disabled = true;
    bookBtn.textContent = "Booking...";

    try {
      const res = await fetch("book.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedYMD,
          time,
          name,
          email,
          phone: phone
        })
      });

      const data = await res.json().catch(() => null);
      console.log("res.ok:", res.ok, "status:", res.status, "data:", data);


      if (res.ok && data?.ok) {
        setMsg("✅ Booking confirmed! Check your email.", true);
        bookName.value = "";
        bookEmail.value = "";
        bookPhone.value = "";
        await loadAvailableTimes(selectedYMD);
      } else if (res.status === 409) {
        setMsg("That time was just booked. Pick another time.", true);
        await loadAvailableTimes(selectedYMD);
      } else {
        setMsg(data?.error || "Booking failed. Please try again.", false);
      }
    } catch (e) {
      setMsg("Booking failed (network error). Please try again.", false);
    } finally {
      bookBtn.disabled = false;
      bookBtn.textContent = "Book";
    }
  });
});
