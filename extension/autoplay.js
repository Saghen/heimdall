const inject = document.createElement('script')
inject.innerHTML = `
const tryToPlay = () => document.querySelector('.html5-video-player').dispatchEvent(new CustomEvent('click', {}));
const intervalId = setInterval(() => { tryToPlay(); clearInterval(intervalId) }, 50)
`
document.body.appendChild(inject)
