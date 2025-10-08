import { spawn } from 'child_process'

const mode = process.argv[2] && ['watch', 'hmr'].includes(process.argv[2]) ? process.argv[2] : 'hmr'

if (!mode || !['watch', 'hmr'].includes(mode)) {
  console.error('❌ Invalid mode. Use: node serve <watch|hmr>')
  process.exit(1)
}

console.log(`🚀 Starting Adonis server in ${mode.toUpperCase()} mode...`)

function startServer() {
  const args = ['ace', 'serve', `--${mode}`]
  const server = spawn('node', args, {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true,
  })

  let restarting = false

  const restart = (reason = 'Server stopped unexpectedly') => {
    if (restarting) return
    restarting = true
    console.log(`\n🔁 Restarting Adonis server... (${reason})\n`)

    try {
      server.kill('SIGTERM')
    } catch (_) {}

    setTimeout(() => {
      startServer()
    }, 500)
  }

  server.stdout.on('data', (data) => {
    const text = data.toString()
    process.stdout.write(text)

    if (mode === 'watch' && text.includes('Underlying HTTP server died')) {
      restart('Underlying HTTP server died')
    }
  })

  server.stderr.on('data', (data) => {
    const text = data.toString()
    process.stderr.write(text)

    if (mode === 'watch' && text.includes('Underlying HTTP server died')) {
      restart('Underlying HTTP server died')
    }
  })

  server.on('exit', (code, signal) => {
    if (restarting) return

    if (mode === 'hmr') {
      restart(`HMR server exited (code: ${code}, signal: ${signal})`)
      return
    }

    console.log(`⚠️ Server exited with code ${code} (signal: ${signal})`)
    restart('Unexpected server exit')
  })
}

startServer()
