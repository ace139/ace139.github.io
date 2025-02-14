// Immediately set the theme to prevent flash
const theme = localStorage.getItem('theme') || 
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.classList.toggle('dark', theme === 'dark');

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const darkIcon = document.getElementById('theme-toggle-dark-icon');
  const lightIcon = document.getElementById('theme-toggle-light-icon');

  if (theme === 'dark') {
    lightIcon?.classList.remove('hidden');
    darkIcon?.classList.add('hidden');
  } else {
    lightIcon?.classList.add('hidden');
    darkIcon?.classList.remove('hidden');
  }

  themeToggle?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    if (isDark) {
      lightIcon?.classList.remove('hidden');
      darkIcon?.classList.add('hidden');
    } else {
      lightIcon?.classList.add('hidden');
      darkIcon?.classList.remove('hidden');
    }
  });
});
