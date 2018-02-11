# TODOs:
- comment on code
- readme


### TODOs: less important
- what to do when network fails?
- [oembed?](https://codex.wordpress.org/Embeds)
- routing
  - change tag and category base
  - change permalink file
  - multi page post pagination
  - child page routing
- use date and time formatting from options obj:
    - map [Anuglar date pipe](https://angular.io/api/common/DatePipe) to [php date formatting](https://codex.wordpress.org/Formatting_Date_and_Time)
- [widgets](https://wordpress.org/plugins/wp-rest-api-sidebars/) maybe not...
    - [custom templates](https://wordpress.stackexchange.com/questions/97411/code-for-recent-posts-widget)


### Routing:
- ROUTES TO POST/PAGE
    - `/{post-or-page-slug}/` 👍
    - `/{post-slug}/page/{page-number}/`
    - `/{post-slug}/comment-page-{number}/#comments` 👎 this doesn't work because we can't match partial route params in a string
        - `/{post-slug}/comment-page/{comment-page-number}` 👍 this works, however
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

## Support
- customizer
  - with live updates
  - add any content to the head
  - add any content to the footer
- router path - low priority
  - [link](https://wordpress.stackexchange.com/questions/58625/where-is-permalink-info-stored-in-database)
- front page
- # of posts
- login?
- SEO visibility