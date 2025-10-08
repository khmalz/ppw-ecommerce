import { spawn } from 'child_process'

function startServer() {
  const server = spawn('node', ['ace', 'serve', '--watch'], {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true,
  })

  let serverDiedDetected = false

  server.stdout.on('data', (data) => {
    const text = data.toString()
    process.stdout.write(text)

    if (text.includes('Underlying HTTP server died')) {
      serverDiedDetected = true
      console.log('Detected server died. Restarting...')
      server.kill()
    }
  })

  server.stderr.on('data', (data) => {
    const text = data.toString()
    process.stderr.write(text)

    if (text.includes('Underlying HTTP server died')) {
      serverDiedDetected = true
      console.log('Detected server died. Restarting...')
      server.kill()
    }
  })

  server.on('close', (code) => {
    if (serverDiedDetected) {
      setTimeout(() => {
        startServer()
      }, 500)
    } else {
      console.log(`Server exited with code ${code}`)
    }
  })
}

startServer()
