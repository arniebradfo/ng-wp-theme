# NG-WP

A minimal WordPress theme that runs off of an Angular 5 app. 

Originally built for the tutorial http://doppiaeast.com/article/angular-2-wordpress-theme-setup/.

## Usage

First, run `npm install`.

Inside the environments folder, you will find two files -- one for production and one for development. Open each up and set wpBase to whatever you dev and live sites are. 

For development, simply run `ng serve`, in the terminal inside the project folder, and the CLI will do the rest. The content of the site is managed from the WordPress admin panel.  

To push the project to the server, run `ng build --prod --deploy-url="/wp-content/themes/{THEME_DIRECTORY_NAME}/dist/"` from your command line. This will output a `dist` folder. Upload index.php, styles.css, functions.php, and the dist folder to your theme directory on your server. You should be good to go!

This project will play nice with the Angular CLI.


## Contributions
Pull requests always welcome
- Do not use any css

## Links
- [WP REST API](https://developer.wordpress.org/rest-api/)
- [Menus for WP REST API](https://wordpress.org/plugins/wp-api-menus/)
- ["Embeddable" Angular Components](https://github.com/wardbell/ng-dynamic-app) [video](https://www.youtube.com/watch?v=__H65AsA_bE&feature=youtu.be&t=2h14m13s)
