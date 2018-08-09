let mix = require('laravel-mix')

mix.js('resources/assets/js/app.js', 'public/js')
   .extract(['lodash', 'jquery', 'axios', 'vue', 'vuex'])
   .sass('resources/assets/sass/app.sass', 'public/css')
