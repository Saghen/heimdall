const browser = globalThis.browser ?? globalThis.chrome

window.addEventListener('message', (e) => {
  if (e.source !== window || !e.data?.saggy) return
  console.log('SENDING', e.data)
  browser.runtime.sendMessage(e.data, (data) => {
    console.log('RECEIVED', data)
    e.ports[0].postMessage(data)
  })
})
