setTimeout(() => {
  // SETUP LINK
  const deviceId =
    localStorage.getItem("deviceId") ??
    `${Math.floor(10000 * (new Date().valueOf() + Math.random()))}`

  let clientId = ""
  try {
    clientId = ga.getAll()[0].get("clientId")
  } catch {}

  const link =
    "https://chrome.google.com/webstore/detail/leadjet/kojhcdejfimplnokhhhekhiapceggamn?v=" +
    deviceId +
    "&ga=" +
    clientId

  // SETUP CTAs
  document
    .querySelectorAll(
      "#add-to-chrome-navbar, #add-to-chrome-hero, #add-to-chrome-footer"
    )
    .forEach((e) => {
      e.href = link
      e.onclick = goToChromeStoreClick
    })
}, 500)

function goToChromeStoreClick() {
  var headers = new Headers()
  headers.append("Content-Type", "application/json")

  var raw = JSON.stringify({ type: "GO_TO_CHROME_STORE", deviceId: deviceId })

  var requestOptions = {
    method: "POST",
    headers: headers,
    body: raw,
    redirect: "follow",
  }

  fetch("https://api.leadjet.io/pevent", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error))
}

// VIDEO AUTOPLAY
;(function (window) {
  var playing = false

  function setupVideo() {
    var video = document.getElementById("cover-vid")
    video.addEventListener(
      "mouseover",
      function () {
        this.controls = true
      },
      false
    )
    video.addEventListener(
      "mouseout",
      function () {
        this.controls = false
      },
      false
    )
  }

  function checkScroll() {
    var video = document.getElementById("cover-vid")

    var y = video.offsetTop,
      h = video.offsetHeight,
      b = y + h, //bottom
      visibleY,
      visible

    visibleY = Math.max(
      0,
      Math.min(
        h,
        window.pageYOffset + window.innerHeight - y,
        b - window.pageYOffset
      )
    )

    visible = visibleY / h
    if (!playing && visible < 0.8) {
      video.play()
      playing = true
    }
  }

  window.addEventListener("scroll", checkScroll, false)
  window.addEventListener("resize", checkScroll, false)
  window.addEventListener("load", setupVideo, false)
})(window)
