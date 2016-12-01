module.exports = function (grunt) {

    grunt.initConfig({
        watch:{
            jade:{
                files:['views/**'],     //监听改变文件的目录
                options:{
                    livereload:true
                }
            },
            js:{
                files:['putlic/js/**','mode/**/*.js','schemas/**/*.js'],  //监听js文件的改变
                //tasks:['jshint'],    语法检测
                options:{
                    livereload:true
                }
            }
        },
        nodemon:{
            dev:{
                options:{
                    file:'app.js',
                    args:[],
                    ignoredFiles:['README.md','node_modules/**','.DS_Store'],
                    watchedExtensions:['js'],
                    watchedFolders:['./'],
                    debug:true,
                    delayTime:1,
                    env:{
                        PORT:3000
                    },
                    cwd : __dirname
                }
            }
        },

        concurrent:{
            tasks:['nodemon','watch'],
            options:{
                logConcurrentOutput:true
            }
        }
    })




    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-nodemon')
    grunt.loadNpmTasks('grunt-concurrent')


    grunt.option('force',true)  //避免语法出错而中断任务
    grunt.registerTask('default',['concurrent'])
}