setTimeout(() => {
  // SETUP LINK
  const deviceId =
    localStorage.getItem("deviceId") ??
    `${Math.floor(10000 * (new Date().valueOf() + Math.random()))}`

  localStorage.setItem("deviceId", deviceId)

  let gaID = ""
  try {
    gaID = ga.getAll()[0].get("clientId")
  } catch {}

  const link =
    "https://chrome.google.com/webstore/detail/leadjet-make-your-crm-wor/kojhcdejfimplnokhhhekhiapceggamn?v=" +
    deviceId +
    "&ga=" +
    gaID

  // SETUP CTAs
  document.querySelectorAll(".chrome-store-cta").forEach((e) => {
    if (isBVersion(deviceId) && window.location.pathname !== "/register") {
      e.href = "/register"
      e.target = ""
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
    var submitBtn = document.querySelector("form#email-form input[type=submit]")
    console.log(submitBtn)
    submitBtn.addEventListener("click", () => {
      var emailField = document.querySelector(
        "form#email-form input[type=email]"
      )
      console.log(emailField)
      if (validateEmail(emailField.value)) {
        postPidentify(deviceId, { email: emailField.value })
        postPevent("REGISTERED_EMAIL", deviceId, null)
      }
    })
  }
}, 500)

// AB testing : is it version A or version B ?
function isBVersion(id) {
  return Number(
    id
      .toString()
      .split("")
      .reduce((a, v) => Number(a) + Number(v))
      .toString(2)
      .split("")
      .slice(-1)[0]
  )
}

function postToServer(body, path) {
  var headers = new Headers()
  headers.append("Content-Type", "application/json")

  var requestOptions = {
    method: "POST",
    headers: headers,
    body: body,
    redirect: "follow",
  }

  fetch("https://api.leadjet.io" + path, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error))
}

function postPevent(type, deviceId, props) {
  var body = {
    type: type,
    deviceId: deviceId,
  }

  if (props) body.props = props

  postToServer(JSON.stringify(body), "/pevent")
}

function postPidentify(id, traits) {
  var body = JSON.stringify({
    anonymousID: id,
    traits: traits,
  })

  postToServer(body, "/pidentify")
}

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}
