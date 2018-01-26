import { Component, OnInit } from '@angular/core';
import { IWpPost, IWpPage } from '../../interfaces/wp-rest-types';
import { WpRestService } from '../../services/wp-rest.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'ngwp-post-list',
  templateUrl: './post-list.component.html',
})
export class PostListComponent implements OnInit {

  posts: (IWpPost|IWpPage)[];
  error: string;
  postsPerPage: number;
  pageNumber: number;

  constructor(
    private wpRestService: WpRestService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    console.log(this.activatedRoute);

    this.activatedRoute.params.forEach((params: Params) => {

      this.pageNumber = +params['pageNumber'] || 1;
      let type: 'tag'|'category'|'author'|'search'|undefined = params['type'];
      let slug: string|undefined = params['slug'];

      this.activatedRoute.queryParams.forEach((queryParams: Params) => {

        if (queryParams.s != null) {
          type = 'search';
          slug = queryParams.s;
        }

        Promise.all([
          this.wpRestService.getPosts(type, slug),
          this.wpRestService.options
        ]).then(res => {
            const posts = res[0];
            const options = res[1];
            this.postsPerPage = options.reading.posts_per_page;
            const lowerIndex = this.postsPerPage * (this.pageNumber - 1);
            const upperIndex = this.postsPerPage * this.pageNumber;
            this.posts = posts.slice(lowerIndex, upperIndex);
          }, err => this.error = err );

      });
      
    });

  }

}
