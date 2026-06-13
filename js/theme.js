// Check for saved theme preference immediately to prevent FOUC
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.classList.add(currentTheme);
    // Also add to body if it already exists, otherwise the DOMContentLoaded will handle it
    if (document.body) {
        document.body.classList.add(currentTheme);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Ensure body has the class if it was added to documentElement
    if (currentTheme && !document.body.classList.contains(currentTheme)) {
        document.body.classList.add(currentTheme);
    }

    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            document.documentElement.classList.toggle('light-mode');

            // Save preference
            if (body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light-mode');
            } else {
                localStorage.removeItem('theme');
            }
        });
    }
});
