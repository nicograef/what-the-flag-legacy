class UI {
  constructor() {
    this.flag = document.getElementById('flag')
    this.country = document.getElementById('country')
    this.capital = document.getElementById('capital')
    this.options = document.getElementById('options')
    this.question = document.getElementById('question')
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
    if (app.data.gameMode.includes('flag-to')) this.flag.style.display = 'block'
    else if (app.data.gameMode.includes('country-to')) this.country.style.display = 'block'
    else if (app.data.gameMode.includes('capital-to')) this.capital.style.display = 'block'
    this.options.style.display = 'flex'
  }

  setQuestion(country) {
    this.showGame()
    return new Promise((resolve, reject) => {
      this.flag.onload = () => resolve()
      this.flag.src = country.flag
      this.country.textContent = country.name[app.data.language]
      this.capital.textContent = country.capital
    })
  }

  showOptions(options, solution) {
    this.options.innerHTML = ''
    options.forEach(option => {
      const btn = document.createElement('button')
      btn.className = 'button button-large button-raised button-fill'
      if (option.name === solution.name) btn.classList.add('solution')
      if (app.data.gameMode.includes('to-country')) btn.textContent = option.name[app.data.language]
      else if (app.data.gameMode.includes('to-capital')) btn.textContent = option.capital
      else if (app.data.gameMode.includes('to-flag'))
        btn.style.background = `center / cover no-repeat url(${option.flag})`

      this.options.appendChild(btn)
    })
  }

  showSolution(clicked) {
    if (clicked.className !== 'solution') {
      clicked.classList.add('color-red')
      clicked.classList.add('border-color-red')
    }
    document.querySelector('.solution').classList.add('color-green')
    document.querySelector('.solution').classList.add('border-color-green')
  }

  clearUI() {
    this.flag.style.display = 'none'
    this.country.style.display = 'none'
    this.capital.style.display = 'none'
    this.options.style.display = 'none'
  }
}
