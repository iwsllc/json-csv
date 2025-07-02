import { configure } from '@iwsio/eslint-config'

const monoRepoPackages = [
]

const monoRepoNodeProjects = []

const appendConfigs = [
	{
		rules: {
			'@typescript-eslint/no-require-imports': 'off'
		}
	},
	{
		files: ['./test-runner/**/*', './test-runner-core/**/*'],
		rules: {
			'@stylistic/max-statements-per-line': ['warn', { max: 2 }],
			'no-undef': 'off',
			'@typescript-eslint/no-unused-expressions': 'off' // for chai assertions
		}
	}
]

export default configure({ monoRepoPackages, monoRepoNodeProjects, appendConfigs, includeReact: false })
