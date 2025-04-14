// // Load nav bar from index.html
// window.addEventListener("DOMContentLoaded", () => {
//     fetch("index.html")
//       .then((response) => response.text())
//       .then((html) => {
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(html, "text/html");
//         const navbar = doc.querySelector("header");
//         if (navbar && document.getElementById("navbar-placeholder")) {
//           document.getElementById("navbar-placeholder").innerHTML = navbar.outerHTML;
//         }
//       })
//       .catch((err) => console.error("Failed to load navbar:", err));
//   });
  // Responsive Navbar Toggle
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu-container');
    navMenu.classList.toggle('hidden');
  }
  
  // Optionally add smooth scrolling for navigation
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      window.scrollTo({
        top: targetElement.offsetTop - 50, // Offset for fixed navbar
        behavior: 'smooth',
      });
    });
  });
  