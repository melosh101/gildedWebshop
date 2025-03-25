import "./style.css";
import "./script";

function initializeDesktopDropdown() {
	const dropdownButton = document.querySelector("[data-dropdown-toggle]");
	const dropdownContent = document.querySelector("[data-dropdown-content]");

	if (dropdownButton && dropdownContent) {
		const dropdownParent = dropdownButton.parentElement!;

		dropdownParent.addEventListener("mouseenter", () => {
			dropdownContent.classList.remove("hidden");
			dropdownButton.setAttribute("aria-expanded", "true");
		});

		dropdownParent.addEventListener("mouseleave", () => {
			dropdownContent.classList.add("hidden");
			dropdownButton.setAttribute("aria-expanded", "false");
		});

		dropdownButton.addEventListener("click", (e) => {
			e.preventDefault();
			dropdownContent.classList.toggle("hidden");

			const isExpanded = !dropdownContent.classList.contains("hidden");
			dropdownButton.setAttribute("aria-expanded", isExpanded.toString());
		});
	}
}

function initializeMobileMenu() {
	const mobileMenuButton = document.getElementById("mobile-menu-button");
	const mobileMenu = document.getElementById("mobile-menu");
	const mobileDropdownButton = document.getElementById(
		"mobile-dropdown-button"
	);
	const mobileDropdownContent = document.getElementById(
		"mobile-dropdown-content"
	);

	if (mobileMenuButton && mobileMenu) {
		mobileMenuButton.addEventListener("click", () => {
			mobileMenu.classList.toggle("hidden");
		});
	}

	if (mobileDropdownButton && mobileDropdownContent) {
		mobileDropdownButton.addEventListener("click", () => {
			mobileDropdownContent.classList.toggle("hidden");
		});
	}
}

document.addEventListener("DOMContentLoaded", () => {
	initializeDesktopDropdown();
	initializeMobileMenu();
});
