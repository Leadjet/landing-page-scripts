setTimeout(() => {
  // SETUP LINK
  let deviceId = localStorage.getItem("deviceId")

  if (!deviceId) {
    deviceId = `${Math.floor(10000 * (new Date().valueOf() + Math.random()))}`
    localStorage.setItem("deviceId", deviceId)
    postPevent("FIRST_VISIT_WEBSITE", deviceId, {
      origin: window.location.pathname,
    })
  }

  let gaID = ""
  try {
    gaID = ga.getAll()[0].get("clientId")
  } catch {}

  const link =
    "https://chrome.google.com/webstore/detail/leadjet-make-your-crm-wor/kojhcdejfimplnokhhhekhiapceggamn?v=" +
    deviceId +
    "&ga=" +
    gaID

  // REGISTER BUTTON
  if (window.location.pathname === "/register") {
    postPevent("GO_TO_REGISTER", deviceId, null)
    var form = document.querySelector("form#email-form")
    form.addEventListener("submit", () => {
      var emailField = document.querySelector(
        "form#email-form input[type=email]"
      )
      if (validateEmail(emailField.value)) {
        postPidentify(deviceId, { email: emailField.value })
        postPevent("REGISTERED_EMAIL", deviceId, null)
      }
    })
  }
}, 500)

////////////////// UTILS //////////////////

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
  const storageEvents = localStorage.getItem("events")
  let events = []
  let alreadyPosted = false

  if (storageEvents !== null) {
    events = JSON.parse(storageEvents)
  }

  if (events.includes(type)) {
    alreadyPosted = true
  } else {
    events.push(type)
    localStorage.setItem("events", JSON.stringify(events))
  }

  var body = {
    type: type,
    deviceId: deviceId,
  }

  if (props) body.props = props

  if (!alreadyPosted) postToServer(JSON.stringify(body), "/pevent")
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
