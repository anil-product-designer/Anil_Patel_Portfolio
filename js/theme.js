// Theme toggle temporarily disabled - default to dark mode
localStorage.removeItem('theme');
document.documentElement.classList.remove('light-mode');
if (document.body) {
    document.body.classList.remove('light-mode');
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.remove('light-mode');
    document.documentElement.classList.remove('light-mode');
    
    // Hide the theme toggle button if it exists
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.style.display = 'none';
    }
});
