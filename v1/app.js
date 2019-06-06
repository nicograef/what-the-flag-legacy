const flag = document.getElementById('flag')
const name = document.getElementById('name')
const capital = document.getElementById('capital')
const loader = document.getElementById('loader')
const loaderName = document.getElementById('loader-name')

// Time to guess the answer in seconds
const waitingTime = 5

// click does not work on ios
const clickOrTouch = navigator.userAgent.match(/iPhone|iPad/i) ? 'touchstart' : 'click'

let flagTimeout, nameTimeout
;(async function getData() {
  const response = await fetch('https://restcountries.eu/rest/v2/all?fields=name;capital;flag;translations')
  const data = await response.json()

  document.body.addEventListener(clickOrTouch, newFlag)
  name.textContent = 'click to start'

  function newFlag() {
    goFullScreen()

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
        name.textContent = currentItem.translations.de
      }, waitingTime * 1000)
    }
    flagTimeout = setTimeout(() => (flag.src = currentItem.flag), 500)
  }
})()

function goFullScreen() {
  var doc = window.document
  var docEl = doc.documentElement

  var requestFullScreen =
    docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen
  var cancelFullScreen =
    doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen

  // if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
  requestFullScreen.call(docEl)
  // } else {
  // cancelFullScreen.call(doc)
  // }
}
