/* 1) 3D ring: auto-rotates, tilts with the pointer and spins faster as you scroll.
   2) Hero scroll effect: the hero card stays pinned while the headline changes in three steps. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ----- 3D ring (plain JS, works even if GSAP fails to load) -----
  var ring = document.getElementById("ring");
  var stage = document.getElementById("stage");
  if (ring && stage) {
    var angle = 20, tiltX = -6, tiltY = 0, targetX = -6, targetY = 0;

    stage.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect();
      targetY = ((e.clientX - r.left) / r.width - 0.5) * 40;   // left/right tilt
      targetX = -6 - ((e.clientY - r.top) / r.height - 0.5) * 24; // up/down tilt
    });
    stage.addEventListener("pointerleave", function () { targetX = -6; targetY = 0; });

    var last = performance.now();
    function frame(now) {
      var dt = Math.min(now - last, 50); last = now;
      if (!reduce) { angle += dt * 0.012; }                        // slow auto-rotation
      tiltX += (targetX - tiltX) * 0.08;                           // smooth easing
      tiltY += (targetY - tiltY) * 0.08;
      var scrollSpin = reduce ? 0 : window.scrollY * 0.18;         // scroll adds extra spin
      ring.style.transform = "rotateX(" + tiltX + "deg) rotateY(" + (angle + scrollSpin + tiltY) + "deg)";
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // ----- Hero headline steps -----
  if (reduce || !window.gsap || !window.ScrollTrigger) { return; } // page still works without animation
  gsap.registerPlugin(ScrollTrigger);

  var steps = gsap.utils.toArray(".step");
  gsap.set(steps.slice(1), { autoAlpha: 0, y: 40 });

  var tl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    scrollTrigger: { trigger: "#hero", start: "top top", end: "+=300%", scrub: 0.6, pin: true, anticipatePin: 1 }
  });

  tl.to(steps[0], { autoAlpha: 0, y: -40, duration: 0.5 }, 0.9)
    .fromTo(steps[1], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 1.2);
  tl.to(steps[1], { autoAlpha: 0, y: -40, duration: 0.5 }, 1.9)
    .fromTo(steps[2], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 2.2);
})();
