// 引进yeoman-generator
let Generator = require('yeoman-generator')

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts)
  }

  // 安装脚手架时的提问信息
  async prompting() {
    const questions = [
      {
        type: 'list',
        name: 'projectType',
        message: '请选择项目类型',
        choices: [
          {
            name: 'PC',
            value: 'pc'
          },
          {
            name: 'Mobile H5',
            value: 'mobile'
          },
          {
            name: 'Node project',
            value: 'module'
          }
        ]
      },
      {
        type: 'input',
        name: 'projectName',
        message: '输入项目名称(英文无空格)',
        default: this.appname
      },
      {
        type: 'input',
        name: 'projectAuthor',
        message: '项目开发者',
        store: true,
        default: ''
      },
      {
        type: 'input',
        name: 'projectVersion',
        message: '项目版本号',
        default: '0.0.1'
      }
    ]
    this.answers = await this.prompt(questions)
  }

  writing() {
    const targetDir = this.answers.projectType
    // 安装脚手架时复制的内容块的目录
    this.fs.copy(
      this.templatePath(`${targetDir}/`),
      this.destinationPath(''),
      {
        globOptions: { dot: true }
      }
    )

    this.fs.copyTpl(
      this.templatePath(`${targetDir}/package.json`),
      this.destinationPath('package.json'),
      { projectName: this.answers.projectName, projectVersion: this.answers.projectVersion }
    )

    this.log('项目初始化完成，请根据 README.md 执行命令 `npm i` / `yarn` 安装依赖~')
  }
}
