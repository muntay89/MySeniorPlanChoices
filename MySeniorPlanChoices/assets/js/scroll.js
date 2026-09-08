document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;

    const startPosition = window.pageYOffset;
    const rect = target.getBoundingClientRect();
    const targetPosition = startPosition + rect.top; // change this if you want offset
    const distance = targetPosition - startPosition;
    const duration = 750; // duration in ms (increase to scroll slower)
    let startTime = null;

    function animation(currentTime) {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    // ease function (easeInOutCubic)
    function ease(t, b, c, d) {
      t /= d/2;
      if (t < 1) return c/2*t*t*t + b;
      t -= 2;
      return c/2*(t*t*t + 2) + b;
    }

    requestAnimationFrame(animation);
  });
});

const checkbox = document.getElementById('agree');
const submitBtn = document.getElementById('submit-btn');

checkbox.addEventListener('change', () => {
    submitBtn.disabled = !checkbox.checked;
});


