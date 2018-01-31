# NG-WP

A minimal WordPress theme that runs off of an Angular 4 app. 

Originally built for the tutorial http://doppiaeast.com/article/angular-2-wordpress-theme-setup/.

## Usage

First, run `npm install`.

Inside the environments folder, you will find two files -- one for production and one for development. Open each up and set wpBase to whatever you dev and live sites are. 

For development, simply run `ng serve`, in the terminal inside the project folder, and the CLI will do the rest. The content of the site is managed from the WordPress admin panel.  

To push the project to the server, run `ng build --prod --deploy-url="/wp-content/themes/{THEME_DIRECTORY_NAME}/dist/"` from your command line. This will output a `dist` folder. Upload index.php, styles.css, functions.php, and the dist folder to your theme directory on your server. You should be good to go!

This project will play nice with the Angular CLI.

## Contributions

Pull requests always welcome

## TODOs:
- comment submission
- shortcodes
- widgets
    - search

### TODOs: less important
- put sticky posts first
- child page routing
- multi page post pagination
- use date and time formatting from options obj:
    - map [Anuglar date pipe](https://angular.io/api/common/DatePipe) to [php date formatting](https://codex.wordpress.org/Formatting_Date_and_Time)

### Routing:
- ROUTES TO POST/PAGE
    - `/{post-or-page-slug}/` 👍
    - `/{post-slug}/page/{page-number}/` 
    - `/{post-slug}/comment-page-{number}/#comments` 👎 this doesn't work because we can't match partial route strings
    - `/{post-slug}/comment-page/{comment-page-number}` 👍
    - `/{page-slug}/{child-page-slug}/{grandchild-page-slug}/{ect...}`
- ROUTES TO LIST
    - `/` 👍
    - `/page/{page-number}/` 👍
    - `/category|tag|author/{category-slug|tag-slug|author-slug}/` 👍
    - `/category|tag|author/{category-slug|tag-slug|author-slug}/page/{page-number}/` 👍
    - `/?s={search-term}` 👍
    - `/page/{page-number}/?s={search-term}` 👍
- BACKEND
    - `/wp-admin/*` 👍
- password protected stuff ??
- change tag and category base
- change permalink file