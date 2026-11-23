(function () {
  const filters = document.querySelectorAll("[data-gallery-filter]");
  const grid = document.querySelector("[data-gallery-grid]");
  if (!filters.length || !grid) return;

  // The markup lists every photo in descending date order.
  const cards = Array.from(grid.querySelectorAll("[data-gallery-card]"));

  function arrangeRows(photos) {
    const rows = [];
    let next = 0;
    // Use up to three photos per row and distribute them evenly.
    for (let remaining = Math.ceil(photos.length / 3); remaining > 0; remaining--) {
      const size = Math.ceil((photos.length - next) / remaining);
      const row = document.createElement("div");
      row.className = "photo-row";
      row.append(...photos.slice(next, next + size));
      rows.push(row);
      next += size;
    }
    grid.replaceChildren(...rows);
  }

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const category = filter.dataset.galleryFilter;

      filters.forEach((item) => {
        const active = item === filter;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      const visible = cards.filter((card) => category === "all" || card.dataset.galleryCategory === category);
      arrangeRows(visible);
    });
  });
})();
