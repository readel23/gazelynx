/*
 * Optional enhancement for the concept illustration.
 *
 * On pointer-capable devices, the gaze marker follows the cursor while it is
 * over the illustrated screen, and returns to its idle loop on leave.
 * The page is fully functional without this file.
 */
(function () {
  "use strict";

  var scene = document.getElementById("scene");
  var screen = document.getElementById("screen");
  var gaze = document.getElementById("gaze");

  if (!scene || !screen || !gaze) return;

  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!finePointer.matches || reducedMotion.matches) return;

  var frame = 0;

  function track(event) {
    if (frame) return;

    frame = window.requestAnimationFrame(function () {
      frame = 0;

      var box = screen.getBoundingClientRect();
      if (!box.width || !box.height) return;

      var x = ((event.clientX - box.left) / box.width) * 100;
      var y = ((event.clientY - box.top) / box.height) * 100;

      gaze.style.setProperty("--gx", clamp(x) + "%");
      gaze.style.setProperty("--gy", clamp(y) + "%");
    });
  }

  function clamp(value) {
    return Math.min(94, Math.max(6, value)).toFixed(2);
  }

  function release() {
    if (frame) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }
    scene.classList.remove("is-tracking");
    gaze.style.removeProperty("--gx");
    gaze.style.removeProperty("--gy");
  }

  screen.addEventListener("pointerenter", function (event) {
    if (event.pointerType !== "mouse") return;
    scene.classList.add("is-tracking");
    track(event);
  });

  screen.addEventListener("pointermove", function (event) {
    if (event.pointerType !== "mouse") return;
    if (!scene.classList.contains("is-tracking")) return;
    track(event);
  });

  screen.addEventListener("pointerleave", release);
})();
