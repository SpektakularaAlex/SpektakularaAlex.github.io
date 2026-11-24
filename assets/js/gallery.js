// Lightbox for <ul class="gallery"> with <a href="full-size.jpg"><img></a> items.
// Uses the native <dialog>, so Esc and focus handling come from the browser.
// Without JavaScript the links simply open the image.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll(".gallery a"));
  if (!links.length || !window.HTMLDialogElement) return;

  var box = document.createElement("dialog");
  box.className = "lightbox";
  box.setAttribute("aria-label", "Image viewer");
  box.innerHTML =
    '<button class="lb-close" type="button" aria-label="Close">×</button>' +
    '<button class="lb-prev" type="button" aria-label="Previous image">←</button>' +
    '<figure><img alt=""><figcaption aria-live="polite"><span class="lb-text"></span> <span class="lb-count"></span></figcaption></figure>' +
    '<button class="lb-next" type="button" aria-label="Next image">→</button>';
  document.body.appendChild(box);

  var img = box.querySelector("img");
  var text = box.querySelector(".lb-text");
  var count = box.querySelector(".lb-count");
  var current = 0;

  function show(i) {
    current = (i + links.length) % links.length;
    var thumb = links[current].querySelector("img");
    var caption = links[current].parentNode.querySelector("figcaption");
    img.src = links[current].getAttribute("href");
    img.alt = thumb.alt;
    text.textContent = caption ? caption.textContent : thumb.alt;
    count.textContent = current + 1 + " / " + links.length;
  }

  links.forEach(function (a, i) {
    a.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      show(i);
      box.showModal();
    });
  });
  box.querySelector(".lb-close").addEventListener("click", function () { box.close(); });
  box.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
  box.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
  box.addEventListener("click", function (e) {
    if (e.target === box || e.target.tagName === "FIGURE") box.close();
  });
  box.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); show(current - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); show(current + 1); }
  });
  box.addEventListener("close", function () { links[current].focus(); });
})();
