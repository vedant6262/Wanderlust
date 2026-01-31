document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".filter").forEach(filter => {
    filter.addEventListener("click", () => {
      const category = filter.dataset.category;

      if (category === "all") {
        window.location.href = "/listings";
      } else {
        window.location.href = `/listings?category=${category}`;
      }
    });
  });
});
