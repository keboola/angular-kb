

module.exports = function(grunt) {

	var pkg = grunt.file.readJSON('package.json');

	// load npm tasks defined in package
	for (var npmTask in pkg.devDependencies) {
		if (npmTask.indexOf("grunt-") !== 0) {
			continue;
		}
		grunt.loadNpmTasks(npmTask);
	}

  	// Project configuration.
	grunt.initConfig({
		pkg: pkg,
		meta: {
			banner: '/**\n' +
				' * <%= pkg.description %>\n' +
				' * @version v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				' * @link <%= pkg.homepage %>\n' +
				' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
				' */'
		},
		lint: {
			files: ['Gruntfile.js']
		},
		clean: {
			dist:  ['dist/'],
			tmp: ['tmp/']
		},
		coffee: {
			dist: {
				expand: true,
				cwd: 'src/',
				src: ['**/*.coffee'],
				dest: 'tmp/',
				ext: '.js'
			},
			docs: {
				src: ['docs/scripts/*.coffee'],
				dest: 'docs/scripts/app.js'
			}
		},
		concat: {
			options: {
				banner: '<%= meta.banner %>'
			},
			dist_scripts: {
				src: ['tmp/kb.js', 'tmp/modules/**/!(lang|test)/*.js'],
				dest: 'dist/angular-kb.js'
			},
			dist_css:  {
				src: ['src/**/*.css'],
				dest: 'dist/angular-kb.css'
			}
		},
		cssmin: {
			dist: {
				src: ['<%= concat.dist_css.dest %>'],
				dest: 'dist/angular-kb.min.css'
			}
		},
		// minifications
		uglify: {
			dist: {
				src: ['<%= concat.dist_scripts.dest %>'],
				dest: 'dist/angular-kb.min.js'
			}
		},
		// rebuild coffee on chage
		// rebuild all on index-template or grunt.js change
		watch: {
			coffee: {
				files: ['src/**/*.coffee'],
				tasks: ['coffee', 'concat:dist_scripts', 'uglify', 'karma:unit:run']
			},
			css: {
				files: ['<%= concat.dist_css.src %>'],
				tasks: ['concat:dist_css', 'cssmin']
			},
			grunt: {
				files: ['Gruntfile.js'],
				tasks: 'build'
			},
			docs: {
				files: ['docs/scripts/**/*.coffee'],
				tasks: ['coffee:docs']
			}
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true
			},
			globals: {
				jQuery: true
			}
		},
		karma: {
		  unit: {
		    configFile: 'karma.conf.js'
		  },
		  ci: {
			  configFile: 'karma.conf.js',
			  singleRun: true,
			  browsers: ['PhantomJS']
		  }
		}
	});

	grunt.registerTask('default', [
		'clean',
		'coffee',
		'concat',
		'uglify',
		'cssmin',
		'karma:ci'
	]);

	grunt.registerTask('devel', [
		'watch'
	]);

	grunt.registerTask('testServer', [
		'karma:unit'
	])

 };
