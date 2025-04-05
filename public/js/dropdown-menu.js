document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".dropdown-menu__item");
    const menuContents = document.querySelectorAll(".dropdown-menu__content");
    const openMenuButton = document.getElementById("header-list");
    const closeMenuButton = document.getElementById("header-cancel");
    const dropdownMenu = document.getElementById("dropdown-menu");

    function openDropdownMenu() {
        dropdownMenu.style.display = "flex";
    }

    function closeDropdownMenu() {
        dropdownMenu.style.display = "none";
    }

    openMenuButton.addEventListener("click", openDropdownMenu);
    closeMenuButton.addEventListener("click", closeDropdownMenu);



    menuItems.forEach((item) => {
        item.addEventListener("mouseenter", () => {
            if (!item.hasAttribute("data-target")) {
                menuItems.forEach((el) => el.classList.remove("active"));
                menuContents.forEach((content) => content.classList.remove("active"));
                return;
            }

            menuItems.forEach((el) => el.classList.remove("active"));
            menuContents.forEach((content) => content.classList.remove("active"));

            item.classList.add("active");

            const targetId = item.getAttribute("data-target");
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add("active");
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const catalogItem = document.getElementById("catalog-item");
    const dropdownMenu = document.getElementById("dropdown-menu");
    let timeoutId;

    catalogItem.addEventListener("mouseenter", () => {
        clearTimeout(timeoutId);
        dropdownMenu.style.display = "flex";
    });

    catalogItem.addEventListener("mouseleave", () => {
        timeoutId = setTimeout(() => {
            dropdownMenu.style.display = "none";
        }, 800);
    });

    dropdownMenu.addEventListener("mouseenter", () => {
        clearTimeout(timeoutId);
        dropdownMenu.style.display = "flex";
    });

    dropdownMenu.addEventListener("mouseleave", () => {
        timeoutId = setTimeout(() => {
            dropdownMenu.style.display = "none";
        }, 800);
    });
});


function openModal(modalType) {
    console.log('Opening modal for:', modalType);

    if (modalType === 'delete') {
        const form = document.getElementById('delete-form');
        console.log('Form action:', form.action);
        form.submit();
    }
}