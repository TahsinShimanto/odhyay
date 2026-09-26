import { co2 } from '@tgwf/co2'

const co2Emission = new co2({ model: 'swd' })

export function carbonFootprintMiddleware(req, res, next) {
  let requestBytes = 0
  let responseBytes = 0

  if (req.body) {
    requestBytes = Buffer.byteLength(JSON.stringify(req.body), 'utf8')
  }
  if (req.query) {
    requestBytes += Buffer.byteLength(JSON.stringify(req.query), 'utf8')
  }
  if (req.headers) {
    requestBytes += Buffer.byteLength(JSON.stringify(req.headers), 'utf8')
  }

  const originalWrite = res.write
  const originalEnd = res.end

  res.write = function (chunk) {
    if (chunk) {
      responseBytes += Buffer.byteLength(chunk, 'utf8')
    }
    return originalWrite.apply(res, arguments)
  }

  res.end = function (chunk) {
    if (chunk) {
      responseBytes += Buffer.byteLength(chunk, 'utf8')
    }
    res.locals.totalBytes = requestBytes + responseBytes

    const greenHost = false
    const emissions = co2Emission.perByte(res.locals.totalBytes, greenHost)
    console.log(`Data transferred: ${res.locals.totalBytes} bytes`)
    console.log(`Estimated CO2 emissions: ${emissions.toFixed(5)} grams`)

    return originalEnd.apply(res, arguments)
  }

  next()
}