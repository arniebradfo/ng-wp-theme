import { Component, OnInit } from '@angular/core';
import { IWpPost, IWpPage, IWpTaxonomy } from '../../interfaces/wp-rest-types';
import { WpRestService } from '../../services/wp-rest.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'ngwp-post-list',
  templateUrl: './post-list.component.html',
})
export class PostListComponent implements OnInit {

  posts: (IWpPost | IWpPage)[];
  tagsById: (IWpTaxonomy | undefined)[];
  categoriesById: (IWpTaxonomy | undefined)[];

  error: string;
  postsPerPage: number;
  pageNumber: number;
  pageCount: number[];
  routerPrefix: string = '';
  queryParams: { [key: string]: string; } = {};

  constructor(
    private wpRestService: WpRestService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    // const params = this.activatedRoute.snapshot.params;
    this.activatedRoute.params.forEach(params => {

      this.pageNumber = +params['pageNumber'] || 1;
      let type: 'tag' | 'category' | 'author' | 'search' | undefined = params['type'];
      let slug: string | undefined = params['slug'];

      if (type != null && slug != null) this.routerPrefix = `/${type}/${slug}`;

      // this.activatedRoute.queryParams.forEach((queryParams: Params) => {});
      this.queryParams = this.activatedRoute.snapshot.queryParams;

      if (this.queryParams.s != null) {
        type = 'search';
        slug = this.queryParams.s;
      }

      Promise.all([
        this.wpRestService.getPosts(type, slug),
        this.wpRestService.options
      ]).then(res => {

        const posts = res[0];
        const options = res[1];

        this.postsPerPage = options.reading.posts_per_page;
        this.pageCount = Array(Math.ceil(posts.length / this.postsPerPage)).fill(0);

        const lowerIndex = this.postsPerPage * (this.pageNumber - 1);
        const upperIndex = this.postsPerPage * this.pageNumber;
        this.posts = posts.slice(lowerIndex, upperIndex);

      }, err => this.error = err);

    });
  }

}
