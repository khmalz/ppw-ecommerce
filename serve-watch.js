import { spawn } from 'child_process'

function startServer() {
  const server = spawn('node', ['ace', 'serve', '--watch'], {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true,
  })

  let restarting = false

  const restart = () => {
    if (restarting) return
    restarting = true
    console.log('\n🔁 Restarting Adonis server...\n')

    try {
      server.kill('SIGTERM')
    } catch (_) {}

    setTimeout(() => {
      startServer()
    }, 1000)
  }

  server.stdout.on('data', (data) => {
    const text = data.toString()
    process.stdout.write(text)

    if (text.includes('Underlying HTTP server died')) {
      restart()
    }
  })

  server.stderr.on('data', (data) => {
    const text = data.toString()
    process.stderr.write(text)

    if (text.includes('Underlying HTTP server died')) {
      restart()
    }
  })

  server.on('exit', (code, signal) => {
    if (!restarting) {
      console.log(`⚠️ Server exited with code ${code} (signal: ${signal})`)
      console.log('Restarting automatically...')
      restart()
    }
  })
}

startServer()
