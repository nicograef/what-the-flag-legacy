class UI {
  constructor() {
    this.flag = document.getElementById('flag')
    this.country = document.getElementById('country')
    this.capital = document.getElementById('capital')
    this.options = document.getElementById('options')
    this.question = document.getElementById('question')
  }

  showGame() {
    this.clearUI()
    if (DATA.gameMode.includes('flag-to')) this.flag.style.display = 'block'
    else if (DATA.gameMode.includes('country-to')) this.country.style.display = 'block'
    else if (DATA.gameMode.includes('capital-to')) this.capital.style.display = 'block'
    this.options.style.display = 'flex'
  }

  setQuestion(country) {
    return new Promise((resolve, reject) => {
      this.flag.onload = () => resolve()
      this.flag.src = country.flag
      this.country.textContent = country.name[DATA.language]
      this.capital.textContent = country.capital
    })
  }

  setOptions(options, solution) {
    this.options.innerHTML = ''
    options.forEach(option => {
      const btn = document.createElement('button')
      btn.className = 'button button-large button-raised button-fill'
      if (option.name === solution.name) btn.classList.add('solution')
      if (DATA.gameMode.includes('to-country')) btn.textContent = option.name[DATA.language]
      else if (DATA.gameMode.includes('to-capital')) btn.textContent = option.capital
      else if (DATA.gameMode.includes('to-flag')) btn.style.background = `center / cover no-repeat url(${option.flag})`

      this.options.appendChild(btn)
    })
  }

  revealSolution(clicked) {
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
