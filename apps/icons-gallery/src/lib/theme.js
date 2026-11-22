let isDarkMode = false

function initializeTheme() {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    enableDarkMode()
  } else {
    disableDarkMode()
  }
  updateThemeIcon()
}

function toggleTheme() {
  if (isDarkMode) {
    disableDarkMode()
    saveTheme('light')
  } else {
    enableDarkMode()
    saveTheme('dark')
  }
  updateThemeIcon()
}

function enableDarkMode() {
  document.documentElement.classList.add('dark')
  isDarkMode = true
}

function disableDarkMode() {
  document.documentElement.classList.remove('dark')
  isDarkMode = false
}

function saveTheme(theme) {
  localStorage.setItem('theme', theme)
}

function getThemeIcon() {
  return isDarkMode ? 'az az-moon text-sm' : 'az az-sun text-sm'
}

function updateThemeIcon() {
  const themeIconElement = document.getElementById('themeIcon')
  if (themeIconElement) {
    themeIconElement.className = getThemeIcon()
  }
}

initializeTheme()

export { getThemeIcon, initializeTheme, toggleTheme }
