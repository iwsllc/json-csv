import { configure } from '@iwsio/eslint-config'

const monoRepoPackages = [
]

const monoRepoNodeProjects = []

const appendConfigs = [
	{
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
			'@stylistic/max-statements-per-line': ['warn', { max: 2 }]
		}
	},
	{
		files: ['./test-runner/**/*', './test-runner-core/**/*', './test/**/*'],
		rules: {
			'no-undef': 'off',
			'@typescript-eslint/no-unused-expressions': 'off' // for chai assertions
		}
	}
]

export default configure({ monoRepoPackages, monoRepoNodeProjects, appendConfigs, includeReact: false, includeTailwind: false })
