document.querySelectorAll(".animated-details").forEach((details) => {
  const summary = details.querySelector("summary");
  const content = summary ? summary.nextElementSibling : null;

  if (!summary || !content) {
    return;
  }

  const setHeight = () => {
    content.style.setProperty("--details-height", `${content.scrollHeight}px`);
  };

  setHeight();
  window.addEventListener("resize", setHeight);

  summary.addEventListener("click", (event) => {
    event.preventDefault();
    setHeight();

    if (details.open) {
      content.style.maxHeight = `${content.scrollHeight}px`;
      content.offsetHeight;
      details.classList.add("is-closing");
      details.classList.remove("is-opening");
      window.requestAnimationFrame(() => {
        content.style.maxHeight = "0px";
      });
      window.setTimeout(() => {
        details.open = false;
        details.classList.remove("is-closing");
        content.style.maxHeight = "";
      }, 260);
      return;
    }

    details.open = true;
    content.style.maxHeight = "0px";
    content.offsetHeight;
    details.classList.add("is-opening");
    details.classList.remove("is-closing");
    window.requestAnimationFrame(() => {
      content.style.maxHeight = `${content.scrollHeight}px`;
    });
    window.setTimeout(() => {
      details.classList.remove("is-opening");
      content.style.maxHeight = "";
      setHeight();
    }, 260);
  });
});
