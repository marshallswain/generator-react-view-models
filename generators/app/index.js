'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var path = require('path');
var validate = require('validate-npm-package-name');

module.exports = yeoman.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(`Creating a ${chalk.red('react-view-models')} application.`);

    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    // Pre set the default props from the information we have at this point
    this.props = {
      name: this.pkg.name,
      description: this.pkg.description,
      version: this.pkg.version,
      homepage: this.pkg.homepage,
      repository: this.pkg.repository
    };

    var prompts = [{
      name: 'name',
      message: 'Project name',
      when: !this.pkg.name,
      default: process.cwd().split(path.sep).pop()
    }, {
      name: 'folder',
      message: 'Project main folder',
      default: 'src'
    }, {
      name: 'description',
      message: 'Description',
      when: !this.pkg.description
    }, {
      name: 'homepage',
      message: 'Project homepage url',
      when: !this.pkg.homepage
    }, {
      name: 'githubAccount',
      message: 'GitHub username or organization',
      when: !this.pkg.repository
    }, {
      name: 'authorName',
      message: "Author's Name",
      when: !this.pkg.author,
      store: true
    }, {
      name: 'authorEmail',
      message: "Author's Email",
      when: !this.pkg.author,
      store: true
    }, {
      name: 'authorUrl',
      message: "Author's Homepage",
      when: !this.pkg.author,
      store: true
    }, {
      name: 'keywords',
      message: 'Application keywords',
      when: !this.pkg.keywords,
      filter: _.words
    }, {
      name: 'feathers',
      type: 'confirm',
      message: 'Include Feathers Client?',
      default: false
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer
      this.props = _.extend(this.props, props);
      this.props.name = _.kebabCase(this.props.name);

      var validationResults = validate(this.props.name);
      var isValid = validationResults.validForNewPackages;

      if (!isValid) {
        var warnings = validationResults.warnings;
        var error = new Error('Your project name ' + this.props.name + ' is not ' +
          'valid. Please try another name. Reason: ' + warnings[0]);
        done(error);
        return;
      }
      done();
    }.bind(this));
  },

  writing: function () {
    var pkgName = this.props.name;
    var pkgJsonFields = {
      name: pkgName,
      version: '0.0.0',
      description: this.props.description,
      homepage: this.props.homepage,
      repository: this.props.repository,
      author: {
        name: this.props.authorName,
        email: this.props.authorEmail,
        url: this.props.authorUrl
      },
      scripts: {
        build: 'node build',
        develop: 'done-serve --develop --port 8080 --static',
        document: 'documentjs',
        test: 'testee ' + this.props.folder + '/test.html --browsers firefox --reporter Spec',
        start: 'done-serve --port 8080 --static',
        lint: 'semistandard --fix'
      },
      main: 'index.html',
      files: [this.props.folder],
      keywords: this.props.keywords,
      system: {
        main: 'app.js',
        directories: {
          lib: this.props.folder
        },
        configDependencies: [ 'live-reload' ],
        ext: {
          jsx: 'steal-jsx'
        }
      }
    };

    this.fs.writeJSON('package.json', _.extend(pkgJsonFields, this.pkg));

    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('index.html'),
      this.props
    );
    this.fs.copy(
      this.templatePath('static/**/*'),
      this.destinationPath()
    );
    if (this.props.feathers) {
      this.fs.copy(
        this.templatePath('models/**/*'),
        this.destinationPath('models')
      );
    }
  },

  install: function () {
    var deps = [
      'react-view-models',
      'react',
      'react-dom',
      'can-compute',
      'can-connect',
      'can-define',
      'can-route',
      'can-route-pushstate',
      'classnames',
      'lodash'
    ];
    if (this.props.feathers) {
      deps.concat([
        'feathers',
        'feathers-authentication',
        'feathers-hooks',
        'feathers-reactive',
        'feathers-socketio',
        'rxjs',
        'steal-socket.io'
      ]);
    }
    this.npmInstall(deps, {'save': true});

    var devDeps = [
      'done-serve@0.3.0-pre.0',
      'mocha',
      'semistandard',
      'steal@1.0.0-rc.3',
      'steal-builtins',
      'steal-mocha',
      'steal-tools@1.0.0-rc.7',
      'testee@0.3.0-pre.1'
    ];
    this.npmInstall(devDeps, {'save-dev': true});
  }
});
