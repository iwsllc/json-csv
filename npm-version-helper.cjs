const fs = require('node:fs')
const path = require('node:path')

function gatherVerisonAndEmit(node, script, arg0) {
	const projectPath = path.join(__dirname, arg0, 'package.json')
	if (!fs.existsSync(projectPath)) return

	const projVersion = require(projectPath).version
	process.stdout.write(projVersion, 'utf8')
}

gatherVerisonAndEmit(...process.argv)