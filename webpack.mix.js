let mix = require('laravel-mix');
let cssnano = require('cssnano');
let TerserPlugin = require('terser-webpack-plugin');

mix.sass('sass/novstyle.scss', 'assets/css-novstyle.css')
mix.sass('sass/blog.scss', 'assets/css-blog.css')
mix.sass('sass/cart_page.scss', 'assets/css-cart_page.css')
mix.sass('sass/collection_page.scss', 'assets/css-collection_page.css')
mix.sass('sass/header1.scss', 'assets/css-header1.css')
mix.sass('sass/header2.scss', 'assets/css-header2.css')
mix.sass('sass/header3.scss', 'assets/css-header3.css')
mix.sass('sass/header4.scss', 'assets/css-header4.css')
mix.sass('sass/header5.scss', 'assets/css-header5.css')
mix.sass('sass/header6.scss', 'assets/css-header6.css')
mix.sass('sass/page_inner.scss', 'assets/css-page_inner.css')
mix.sass('sass/product_detail.scss', 'assets/css-product_detail.css')
mix.sass('sass/theme-rtl.scss', 'assets/css-theme-rtl.css')
mix.sass('sass/utilities.scss', 'assets/css-utilities.css');

mix.js('js/animation.js', 'assets/js-animation.js');
mix.js('js/collection-filters-product.js', 'assets/js-collection-filters-product.js');
mix.js('js/product-variants.js', 'assets/js-product-variants.js');
mix.js('js/global.js', 'assets/js-global.js');
mix.js('js/nuranium.js', 'assets/js-nuranium.js');
mix.js('js/theme.js', 'assets/js-theme.js');

mix.webpackConfig({
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
});

mix.options({
  processCssUrls: false,
  autoprefixer: true,
  postCss: [
    cssnano({
      preset: ['default', {
        cssDeclarationSorter: false
      }]
    })
  ]
});
mix.disableNotifications();

//chạy npx mix --production sau khi xong theme để render js thành 1 dòng