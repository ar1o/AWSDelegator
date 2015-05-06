module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch'); 
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-express-server');

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-smushit');
    
    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        connect: {
            dev: {
                options: {
                    port: 4000,
                    base: 'src',
                    hostname: '*'
                }
            },
            dev1: {
                options: {
                    port: 4001,
                    base: 'optimized',
                    hostname: '*',
                    keepalive: true
                }
            }
        },
        express: {
            dev: {
            options: {
                script: 'src/js/EC2.js',
                delay: 1000,
                background: false

              }
            }
        },

        watch: {
            options: {
                livereload: true
            },
            handlebars: {
                files: 'src/templates/*.handlebars',
                tasks: 'handlebars'
            },
            less: {
                files: ['src/css/*.less', 'src/css/*.css'],
                tasks: 'less'
            }
        },

        smushit: {
            group1: {
                src: ['optimized/resources/*'],
                dest: 'optimized/resources'
            }
        },

        less: {
            ieCompatFalse: {
                options: {
                    ieCompat: false
                },
                files: {
                    'src/compiled.css': ['src/css/base.less']
                }
            }
        },
    });
    grunt.registerTask('server', ['livereload-start', 'express', 'regarde']);
    grunt.registerTask('handlebars', 'Compiling templates', function() {
        shell.exec('handlebars src/templates/ -f src/compiledTemplates.js');
    });

    grunt.registerTask('optimize', 'WOOP', function() {
        grunt.task.run('handlebars', 'less', 'optimizeFiles', 'smushit');
    });

    grunt.registerTask('optimizeFiles', 'HOLLA', function() {
        var fs = require('fs');
        // read the manifest
        var manifest = JSON.parse(fs.readFileSync('src/manifest.json').toString());
        // move everything to a new folder
        shell.rm('-rf', 'optimized/');
        shell.cp('-R', 'src/*', 'optimized/');
        // build list of files to not delete
        var keep = {};
        for(var i in manifest.web_accessible_resources)
            keep[ manifest.web_accessible_resources[i] ] = true;
        // merge manifest JS files
        var UglifyJS = require("uglify-js");
        var cache = {};
        for(var i in manifest.content_scripts) {
            // first 
            // go over every file
            var self = manifest.content_scripts[i];
            var js = [];
            for(var j in self.js) {
                var path = 'optimized/' + self.js[j];
                var code;
                try{
                    code = fs.readFileSync(path).toString();
                    cache[path] = code;
                }catch(e) {
                    code = cache[path];
                }
                // delete files
                if(!keep[self.js[j]])
                    shell.rm('-rf', path);
                // minify and store
                code = UglifyJS.minify(code, {fromString: true}).code;
                js.push(code);
            }
            // build optimized file and update manifest
            var optFile = i + '.js';
            var done = this.async();
            fs.writeFile('optimized/' + optFile, js.join('\n'), function(err) {
                if (err) throw err;
                shell.rm('-f', 'optimized/index.html');
                shell.mv('optimized/index.min.html', 'optimized/index.html');
                grunt.task.run('dropDeadweight');
                done(1);
            });
        }
    });

    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }
    
    function destroyUseless(folder) {
        var fs = require('fs');
        var files = fs.readdirSync(folder);
        var fileCount = 0;
        for(var i in files) {
            var name = files[i];
            var path = folder+'/'+name;
            if(name[0] == '.' || name[0] == '#' || name[name.length-1] == '~' || endsWith(name, '.orig')) {
                shell.rm('-rf', path);
            }else if(fs.statSync(path).isDirectory()) {
                fileCount += destroyUseless(path);
            }else{
                fileCount += 1;
            }
        }
        if(!fileCount)
            shell.rm('-rf', folder);
        return fileCount;
    }
    
    grunt.registerTask('dropDeadweight', 'Deleting unrequired files and folders', function() {
        shell.rm('-rf', 'optimized/templates');
        shell.rm('-rf', 'optimized/css');
        shell.rm('-f', 'optimized/manifest.json');
        destroyUseless('optimized');
    });
};
