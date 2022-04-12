var urlParamsFormatted = ""
var deviceId = ""

setTimeout(() => {
  getDeviceId()

  // Save query params
  var search = location.search.substring(1)
  if (search) {
    var storedParamsObj = {}
    var storedParams = localStorage.getItem("urlParams")
    if (storedParams) storedParamsObj = JSON.parse(storedParams)

    var paramsObj = JSON.parse(
      '{"' +
      decodeURI(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
    )

    localStorage.setItem(
      "urlParams",
      JSON.stringify({ ...storedParamsObj, ...paramsObj })
    )
  }

  var urlParams = localStorage.getItem("urlParams")
  if (urlParams) {
    urlParamsFormatted = Object.entries(JSON.parse(urlParams)).map((e) => e.join("=")).join(";")
  }

  var gaID = ""
  try {
    gaID = ga.getAll()[0].get("clientId")
  } catch { }
  
  const link =
    "https://chrome.google.com/webstore/detail/leadjet-make-your-crm-wor/kojhcdejfimplnokhhhekhiapceggamn?v=" +
    deviceId +
    "&ga=" +
    gaID +
    "&utms=" +
    encodeURIComponent(urlParamsFormatted)

  // Register page
  if (window.location.pathname === "/register") {
    // Register page tracking
    postPevent("GO_TO_REGISTER", deviceId, null)

    // Direct form validation
    document.getElementById("register-form").onsubmit = (e) => {
      e.preventDefault()
      register(document.getElementById("email-input").value)
      displayChromeLink()
    }

    // Register button
    document.getElementById("register-btn").onclick = () => {
      register(document.getElementById("email-input").value)
      displayChromeLink()
    }

    // Chrome Store Tracking
    document.querySelectorAll(".chrome-store-cta").forEach((e) => {
      e.href = link
      e.onclick = () => {
        postPevent("GO_TO_CHROME_STORE", deviceId, {
          origin: window.location.pathname,
        })
      }
    })
  }
}, 500)

function getDeviceId() {
  // Device ID
  deviceId = localStorage.getItem("deviceId")
  if (!deviceId) {
    deviceId = `${Math.floor(10000 * (new Date().valueOf() + Math.random()))}`
    localStorage.setItem("deviceId", deviceId)
    postPevent("FIRST_VISIT_WEBSITE", deviceId, { origin: window.location.pathname })
  }
}

function register(email) {
  getDeviceId()
  if (validateEmail(email)) {
    postPidentify(deviceId, { email, urlParamsFormatted })
    postPevent("REGISTERED_EMAIL", deviceId, null)
  }
}

function displayChromeLink() {
  document.getElementById("download-link").style.display = "block"
  document.getElementById("g-signin").style.display = "none"
  document.getElementById("register-form").style.display = "none"
  document.getElementById("register-btn").style.display = "none"
}

////////////////// GOOGLE SIGN-IN //////////////////

function onSuccess(googleUser) {
  console.log("Successful Google Auth");

  register(googleUser.getBasicProfile().getEmail())
  displayChromeLink()
}

function onFailure(googleUser) {
  console.log("Failed Google Auth");
  displayChromeLink()
}

function renderButton() {
  gapi.signin2.render("g-signin", {
    scope: "profile email",
    height: 50,
    width: 340,
    longtitle: true,
    theme: "dark",
    onsuccess: onSuccess,
    onFailure: onFailure,
  })
}

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
  var events = []
  var alreadyPosted = false

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
