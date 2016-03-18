module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      basic_and_extras: {
        files: {
          'public/css/product.css': [
            'public/stylesheets/reset.css',
            'public/stylesheets/header.css',
            'public/stylesheets/product.css'
          ],
          'public/css/order.css': [
            'public/stylesheets/reset.css',
            'public/stylesheets/header.css',
            'public/stylesheets/order.css'
          ],
        }
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'public/css',
          src: ['*.css', '!*.min.css'],
          dest: 'public/css',
          ext: '.min.css'
        }]
      }
    },
    watch: {
      scripts: {
        files: ['public/javascripts/*.js'],
        tasks: ['default'],
        options: {
          spawn: false,
        },
      },
      css: {
        files:['public/stylesheets/*.css'],
        tasks: ['default'],
        options: {
          spawn: false,
        },
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // 默认被执行的任务列表。
  grunt.registerTask('default', ['concat','cssmin']);

};