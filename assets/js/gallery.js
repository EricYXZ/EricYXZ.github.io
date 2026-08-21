(function () {
  const filters = document.querySelectorAll("[data-gallery-filter]");
  const cards = document.querySelectorAll("[data-gallery-card]");

  if (!filters.length || !cards.length) {
    return;
  }

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const category = filter.dataset.galleryFilter;

      filters.forEach((item) => {
        const active = item === filter;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      cards.forEach((card) => {
        const visible = category === "all" || card.dataset.galleryCategory === category;
        card.classList.toggle("is-filtered-out", !visible);
        card.setAttribute("aria-hidden", String(!visible));
      });
    });
  });
})();
