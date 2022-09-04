let data = ''
let apiKey = ''

// TODO: Idk if this is correct for chromium
const isChrome = () => navigator.userAgent.indexOf('Chrome') !== -1

const browser = globalThis.browser ?? globalThis.chrome

const abortControllers = {}

// HOMEPAGE YT DATA
function getInitialData(url = '/', options = {}) {
  return fetch('https://www.youtube.com' + url, { credentials: 'include', ...options })
    .then((res) => res.text())
    .then((text) => text.split('var ytInitialData = ')[1].split('</script>')[0].slice(0, -1))
}

getInitialData().then((text) => (data = text))
setInterval(
  () => getInitialData().then((text) => (data = text)),
  1000 * 60 * 5 // Every 5 minutes
)

// API KEY
function updateApiKey() {
  return fetch('https://www.youtube.com/', { credentials: 'include' })
    .then((res) => res.text())
    .then((text) => {
      apiKey = text.split('"INNERTUBE_API_KEY":"')[1].split('"')[0]
      return apiKey
    })
}

updateApiKey()
setInterval(updateApiKey, 1000 * 60 * 60)

// SAPISID
async function getSAPISIDHash() {
  const cookie = await new Promise((resolve) =>
    chrome.cookies.get({ name: 'SAPISID', url: 'https://youtube.com' }, (cookie) =>
      resolve(cookie.value)
    )
  )
  return hashSAPISID(cookie)
}

function arrayBufferToBase64(buffer) {
  var binary = ''
  var bytes = new Uint8Array(buffer)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

// MESSAGE HANDLERS
const handlers = {
  async fetch({ url, options = {}, hash }) {
    abortControllers[hash] = new AbortController()

    return fetch(url, { ...options, signal: abortControllers[hash].signal })
      .then(async (res) => ({
        data: await res.arrayBuffer().then(arrayBufferToBase64),
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
      }))
      .finally(() => {
        delete abortControllers[hash]
      })
  },
  async fetchAbort({ hash }) {
    abortControllers[hash].abort()
    delete abortControllers[hash]
  },
  async getSAPISIDHash() {
    return getSAPISIDHash().then((SAPISID) => ({ SAPISID }))
  },
  async getAPIKey() {
    return { APIKEY: apiKey ?? (await updateApiKey()) }
  },
  async getInitialData({ url, options }) {
    return getInitialData(url, options).then((json) => ({ json }))
  },
  async getHomePage() {
    if (!data) return getInitialData().then((json) => ({ json }))
    getInitialData().then((text) => (data = text))
    return { json: data }
  },
}

const useAsyncResult = (promise) =>
  promise.then((data) => ({ type: 'success', data })).catch((data) => ({ type: 'error', data }))

async function handleMessage(command, data, sendResponse) {
  if (!handlers[command])
    return sendResponse({ type: 'error', data: new Error('Command not found') })
  useAsyncResult(handlers[command](data)).then((data) => {
    console.log(data)
    sendResponse(data)
  })
}

browser.runtime.onMessage.addListener(({ command, ...data }, _, sendResponse) => {
  handleMessage(command, data, sendResponse)
  return true
})

browser.runtime.onMessageExternal.addListener(({ command, ...data }, _, sendResponse) => {
  handleMessage(command, data, sendResponse)
  return true
})

// Rewrite origin and referer for API requests
const onBeforeSendHeadersPermissions = ['blocking', 'requestHeaders']
if (isChrome()) onBeforeSendHeadersPermissions.push('extraHeaders')

browser.webRequest.onBeforeSendHeaders.addListener(
  (e) => {
    const headersToCheck = ['origin', 'referer']
    const originsToCatch = ['http://localhost:8080/', browser.runtime.getURL('').slice(0, -1)]
    const isFromClient = e.requestHeaders.some(
      (header) =>
        headersToCheck.includes(header.name.toLowerCase()) && originsToCatch.includes(header.value)
    )
    console.log(isFromClient)
    if (!isFromClient) return

    const newRequestHeaders = e.requestHeaders.filter(
      (header) => !['origin', 'referer'].includes(header.name.toLowerCase())
    )
    newRequestHeaders.push(
      { name: 'origin', value: 'https://www.youtube.com' },
      { name: 'referer', value: 'https://www.youtube.com' }
    )
    return { requestHeaders: newRequestHeaders }
  },
  {
    urls: ['https://*.youtube.com/*', 'https://i.ytimg.com/*', 'https://*.ggpht.com/*'],
  },
  onBeforeSendHeadersPermissions
)
