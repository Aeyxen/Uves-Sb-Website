document.addEventListener('DOMContentLoaded', (event) => {
    console.log('Urban Explorer Blog loaded');

    // About Me toggle functionality
    const aboutMeToggle = document.getElementById('about-me-toggle');
    const aboutMeSection = document.getElementById('about-me');

    if (aboutMeToggle && aboutMeSection) {
        aboutMeToggle.addEventListener('click', () => {
            aboutMeSection.style.display = aboutMeSection.style.display === 'block' ? 'none' : 'block';
        });
    }

    // Filter functionality
    const filterOptions = document.getElementById('filter-options');
    const blogPosts = document.querySelectorAll('.post');

    if (filterOptions && blogPosts.length > 0) {
        // Create filter dropdowns
        createFilterDropdown('tag');
        createFilterDropdown('category');

        // Apply filters when checkboxes are changed
        filterOptions.addEventListener('change', applyFilters);
    }

    function createFilterDropdown(type) {
        const items = new Set();
        blogPosts.forEach(post => {
            const elements = post.querySelectorAll(`.${type}`);
            elements.forEach(element => items.add(element.textContent.trim()));
        });

        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown';
        dropdown.innerHTML = `
            <button class="dropdown-toggle">Filter by ${type.charAt(0).toUpperCase() + type.slice(1)}s</button>
            <div class="dropdown-menu" id="${type}-menu"></div>
        `;

        const menu = dropdown.querySelector('.dropdown-menu');
        items.forEach(item => {
            const label = document.createElement('label');
            label.innerHTML = `
                <input type="checkbox" value="${item}" data-filter-type="${type}"> ${item}
            `;
            menu.appendChild(label);
        });

        filterOptions.appendChild(dropdown);

        // Toggle dropdown visibility
        const toggleButton = dropdown.querySelector('.dropdown-toggle');
        toggleButton.addEventListener('click', () => {
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
    }

    function applyFilters() {
        const selectedTags = getSelectedFilters('tag');
        const selectedCategories = getSelectedFilters('category');

        blogPosts.forEach(post => {
            const postTags = Array.from(post.querySelectorAll('.tag')).map(tag => tag.textContent.trim());
            const postCategories = Array.from(post.querySelectorAll('.category')).map(category => category.textContent.trim());

            const tagMatch = selectedTags.length === 0 || selectedTags.some(tag => postTags.includes(tag));
            const categoryMatch = selectedCategories.length === 0 || selectedCategories.some(category => postCategories.includes(category));

            post.style.display = tagMatch && categoryMatch ? 'block' : 'none';
        });
    }

    function getSelectedFilters(type) {
        return Array.from(document.querySelectorAll(`#${type}-menu input:checked`)).map(input => input.value);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Lazy loading for images
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lozad.js/1.16.0/lozad.min.js';
        script.async = true;
        script.onload = function() {
            const observer = lozad();
            observer.observe();
        };
        document.body.appendChild(script);
    }
});