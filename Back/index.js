import { spawn } from "node:child_process"

const child = spawn(process.execPath, ["--import", "tsx", "src/server.ts"], {
	cwd: process.cwd(),
	env: process.env,
	stdio: "inherit",
})

child.on("exit", (code, signal) => {
	if (signal) {
		process.kill(process.pid, signal)
		return
	}
	process.exit(code ?? 1)
})
