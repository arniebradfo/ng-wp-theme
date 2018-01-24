import { Component, OnInit } from '@angular/core';
import { IPost, IPage } from '../../interfaces/wp-rest-types';
import { WpRestService } from '../../services/wp-rest.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'ngwp-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  // providers: [WpRestService]
})
export class PostListComponent implements OnInit {

  posts: (IPost|IPage)[];
  error: string;

  constructor(
    private wpRestService: WpRestService,
    private activatedRoute: ActivatedRoute
  ) { }

  private getPosts() {

  }

  ngOnInit() {
    this.activatedRoute.params.forEach((params: Params) => {
      let type: 'tag'|'category'|'author'|'search'|undefined = params['type'];
      let slug: string|undefined = params['slug'];
      this.activatedRoute.queryParams.forEach((queryParams: Params) => {
        if (queryParams.s != null) {
          type = 'search';
          slug = queryParams.s;
        }
        this.wpRestService.getPosts(type, slug)
          .then(posts => {
            // console.log(posts);
            this.posts = posts;
          }, err => {
            this.error = err;
          });
      });
    });

  }

}
