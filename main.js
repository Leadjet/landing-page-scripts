setTimeout(() => {
  const aff = localStorage.getItem("aff") || ""
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
  document.getElementById("add-to-chrome-navbar").href = link
  document.getElementById("add-to-chrome-navbar").onclick = goToChromeStoreClick
  document.getElementById("add-to-chrome-hero").href = link
  document.getElementById("add-to-chrome-hero").onclick = goToChromeStoreClick
  document.getElementById("add-to-chrome-footer").href = link
  document.getElementById("add-to-chrome-footer").onclick = goToChromeStoreClick

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

  // CTA  test
  console.log(
    google_optimize && google_optimize.get("<M0X6xkCPQR-5SiNYAmdBoQ>")
  )

  function implementExperimentA(value) {
    if (value == "0") {
      console.log(0)
    } else if (value == "1") {
      console.log(1)
    } else if (value == "2") {
      console.log(2)
    }
  }

  gtag("event", "optimize.callback", {
    name: "<M0X6xkCPQR-5SiNYAmdBoQ>",
    callback: implementExperimentA,
  })
}, 500)
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
