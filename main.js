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
      if (isBVersion(deviceId)) {
        e.href = "/register"
        e.addEventListener(
          "click",
          () => {
            postPevent("GO_TO_REGISTER", deviceId, null)
          },
          true
        )
      } else {
        e.href = link
        e.onclick = () => {
          postPevent("GO_TO_CHROME_STORE", deviceId, {
            origin: window.location.pathname,
          })
        }
      }
    })

  // REGISTER BUTTON
  if (window.location.pathname === "/register") {
    var form = document.querySelector("form#email-form")
    form.addEventListener("submit", () => {
      //console.log("pevent")
    })
  }
}, 500)

// AB testing : is it version A or version B ?
function isBVersion(id) {
  return 1
  return id
    .toString()
    .split("")
    .reduce((a, v) => Number(a) + Number(v))
    .toString(2)
    .split("")
    .slice(-1)
}

function postPevent(type, deviceId, props) {
  var headers = new Headers()
  headers.append("Content-Type", "application/json")

  var body = JSON.stringify({
    type: type,
    deviceId: deviceId,
  })

  if (props) body.props = props

  var requestOptions = {
    method: "POST",
    headers: headers,
    body: body,
    redirect: "follow",
  }

  fetch("https://api.leadjet.io/pevent", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error))
}
