import eslintConfig from '../../eslint.config.js'

export default [...eslintConfig, { ignores: ['dist/**', '.build/**'] }]
