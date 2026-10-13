(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1) Typing effect for the role text */
  var roleEl = document.getElementById("roleText");
  var roles = ["Machine Learning Enthusiast", "Predictive Modelling", "Web Design"];
  if (roleEl && !reduce) {
    var r = 0, c = roles[0].length, deleting = true;
    (function tick() {
      var word = roles[r];
      roleEl.textContent = word.slice(0, c);
      var delay = 70;
      if (deleting) { c--; delay = 40; if (c < 0) { deleting = false; r = (r + 1) % roles.length; c = 0; delay = 300; } }
      else { c++; if (c > roles[r].length) { deleting = true; c = roles[r].length; delay = 1600; } }
      setTimeout(tick, delay);
    })();
  }

  /* 2) Scroll reveal */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add("is-in"); }); }

  /* 3) Custom cursor dot (mouse devices only) */
  var cur = document.getElementById("cursor");
  if (cur && window.matchMedia("(pointer: fine)").matches && !reduce) {
    var x = 0, y = 0, cx = 0, cy = 0;
    window.addEventListener("pointermove", function (e) { x = e.clientX; y = e.clientY; cur.classList.add("is-on"); });
    document.addEventListener("pointerover", function (e) {
      cur.classList.toggle("is-big", !!e.target.closest("a, button, input, textarea"));
    });
    (function loop() { cx += (x - cx) * 0.18; cy += (y - cy) * 0.18; cur.style.transform = "translate(" + cx + "px," + cy + "px)"; requestAnimationFrame(loop); })();
  }

  /* 4) Project carousel arrows */
  var car = document.getElementById("carousel");
  function step(dir) { var card = car.querySelector(".card"); car.scrollBy({ left: dir * (card.offsetWidth + 20), behavior: "smooth" }); }
  document.getElementById("prev").addEventListener("click", function () { step(-1); });
  document.getElementById("next").addEventListener("click", function () { step(1); });

  /* 5) Journey tabs */
  var tabs = document.querySelectorAll(".tab");
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      tabs.forEach(function (o) {
        var on = o === t;
        o.classList.toggle("is-active", on);
        o.setAttribute("aria-selected", on);
        document.getElementById(o.getAttribute("aria-controls")).hidden = !on;
      });
    });
  });

  /* 6) Expandable offer cards */
  document.querySelectorAll(".o-card .toggle").forEach(function (b) {
    b.addEventListener("click", function () {
      var card = b.closest(".o-card");
      var open = card.classList.toggle("is-open");
      b.setAttribute("aria-expanded", open);
    });
  });

  /* 7) Contact form: opens the visitor's email app with the message ready */
  document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("fName").value.trim();
    var email = document.getElementById("fEmail").value.trim();
    var msg = document.getElementById("fMsg").value.trim();
    var body = msg + "\n\nFrom: " + name + " (" + email + ")";
    window.location.href = "mailto:punithsimha66@gmail.com?subject=" + encodeURIComponent("Portfolio message from " + name) + "&body=" + encodeURIComponent(body);
  });
})();
