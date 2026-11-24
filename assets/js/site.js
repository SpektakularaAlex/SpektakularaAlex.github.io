// Email: the address is plain obfuscated text in the HTML. This turns
//   <a data-email href="/#contact">…</a>   into a mailto link.
(function () {
  var address = "alexander.cremer.1041@student.uu.se".replace(" [at] ", "@");
  document.querySelectorAll("a[data-email]").forEach(function (a) {
    a.href = "mailto:" + address + (a.dataset.email ? "?subject=" + encodeURIComponent(a.dataset.email) : "");
  });
})();
