class UI {
  constructor() {
    this.flag = document.getElementById('flag')
    this.country = document.getElementById('country')
    this.capital = document.getElementById('capital')
    this.options = document.getElementById('options')
    this.question = document.getElementById('question')
    this.languages = document.getElementById('languages')
    this.games = document.getElementById('games')
    this.loader = document.getElementById('loader')
  }

  showLanguageMenu() {
    this.clearUI()
    this.languages.style.display = 'flex'
  }

  showGamesMenu() {
    this.clearUI()
    this.games.style.display = 'flex'
  }

  showLoader() {
    this.clearUI()
    this.loader.style.display = 'block'
  }

  showGame() {
    this.clearUI()
    if (STATE.gameMode.includes('flag-to')) this.flag.style.display = 'block'
    else if (STATE.gameMode.includes('country-to')) this.country.style.display = 'block'
    else if (STATE.gameMode.includes('capital-to')) this.capital.style.display = 'block'
    this.question.style.display = 'block'
    this.options.style.display = 'flex'
  }

  setQuestion(country) {
    return new Promise((resolve, reject) => {
      this.flag.onload = () => resolve()
      this.flag.src = country.flag
      this.country.textContent = country.name[STATE.language]
      this.capital.textContent = country.capital
    })
  }

  showOptions(options, solution) {
    this.options.innerHTML = ''
    options.forEach(option => {
      const btn = document.createElement('button')
      if (option.name === solution.name) btn.classList.add('solution')
      if (STATE.gameMode.includes('to-flag')) btn.style.background = `center / cover no-repeat url(${option.flag})`
      else if (STATE.gameMode.includes('to-country')) btn.textContent = option.name[STATE.language]
      else if (STATE.gameMode.includes('to-capital')) btn.textContent = option.capital

      this.options.appendChild(btn)
    })
  }

  showSolution(clicked) {
    if (clicked.className !== 'solution') clicked.classList.add('wrong')
    document.querySelector('.solution').classList.add('right')
  }

  clearUI() {
    this.loader.style.display = 'none'
    this.languages.style.display = 'none'
    this.games.style.display = 'none'
    this.flag.style.display = 'none'
    this.country.style.display = 'none'
    this.capital.style.display = 'none'
    this.question.style.display = 'none'
    this.options.style.display = 'none'
  }
}
