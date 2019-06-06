const flag = document.getElementById('flag')
const name = document.getElementById('name')
const capital = document.getElementById('capital')
const loader = document.getElementById('loader')
const loaderName = document.getElementById('loader-name')

// Time to guess the answer in milliseconds
const waitingTime = 5000

// click does not work on ios
const clickOrTouch = navigator.userAgent.match(/iPhone|iPad/i) ? 'touchstart' : 'click'

let flagTimeout, nameTimeout

let data

fetch('https://restcountries.eu/rest/v2/all?fields=name;flag;capital')
  .then(res => res.json())
  .then(jsonData => (data = jsonData))
  .then(init)

function init() {
  document.body.addEventListener(clickOrTouch, newFlag)
  name.textContent = 'click to start'
}

function newFlag() {
  clearTimeout(flagTimeout)
  clearTimeout(nameTimeout)

  flag.src = ''
  name.textContent = ''
  capital.textContent = ''
  loader.style.display = 'block'
  loaderName.style.display = ''

  const index = Math.floor(Math.random() * data.length)
  const currentItem = data[index]
  flag.onload = function() {
    loader.style.display = 'none'
    loaderName.style.display = 'inline-block'
    capital.textContent = currentItem.capital

    nameTimeout = setTimeout(() => {
      loaderName.style.display = 'none'
      name.textContent = currentItem.name
    }, waitingTime)
  }
  flagTimeout = setTimeout(() => (flag.src = currentItem.flag), 500)
}
