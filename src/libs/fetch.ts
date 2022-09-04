import type { SWRResponse } from 'swr'

function base64ToArrayBuffer(base64: string) {
  var binaryString = atob(base64)
  var len = binaryString.length
  var bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

type Message = {
  command: string
  saggy?: true
  [key: string]: any
}

export async function sendMessage(message: Message): Promise<any> {
  if (typeof message.command !== 'string') {
    throw new Error('Command to the proxy must be a string')
  }

  message.saggy = true

  return new Promise((resolve, reject) => {
    setTimeout(() => reject(`Command timeout on ${message.command}\n${JSON.stringify(message)}`), 15000)
    const { port1, port2 } = new MessageChannel()
    port1.addEventListener(
      'message',
      ({ data }) => {
        if (data.type === 'success') resolve(data.data)
        else reject(data.data)
        port1.close()
        port2.close()
      },
      { once: true },
    )
    port1.start()

    window.parent.postMessage(message, '*', [port2])
  })
}

export const matchSWR =
  <Data, A, B, C>(onData: (data: Data) => A, onError: (error: any) => B, onLoading?: () => C) =>
  ({ data, error }: SWRResponse<Data, any>) =>
    error !== undefined ? onError(error) : data !== undefined ? onData(data) : onLoading?.()

type FetchOptions = {
  body?: Record<any, any>
} & Omit<RequestInit, 'body'>

export async function fetcher(url: string, { signal, ...options }: FetchOptions = {}) {
  const hash = Math.round(Math.random() * Number.MAX_SAFE_INTEGER)
    .toString(16)
    .slice(0, 5)

  // @ts-ignore
  if (options.body) options.body = JSON.stringify(options.body)

  return new Promise<Response>((resolve, reject) => {
    signal?.addEventListener('abort', () => {
      sendMessage({
        command: 'fetchAbort',
        hash,
      })
      reject('Fetch was aborted')
    })
    sendMessage({ command: 'fetch', url, options, hash })
      .then(({ data, ...init }) => resolve(new Response(base64ToArrayBuffer(data), init)))
      .catch(reject)
  })
}

export async function fetchSAPISID(): Promise<string> {
  return sendMessage({ command: "getSAPISIDHash" }).then(
    (data) => data.SAPISID
  );
}

export async function fetchAPIKey(): Promise<string> {
  return sendMessage({ command: "getAPIKey" }).then((data) => data.APIKEY);
}
