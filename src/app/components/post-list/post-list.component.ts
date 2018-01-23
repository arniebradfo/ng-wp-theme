import { Component, OnInit } from '@angular/core';
import { IPost } from '../../interfaces/wp-rest-types';
import { WpRestService } from '../../services/wp-rest.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'ngwp-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  // providers: [WpRestService]
})
export class PostListComponent implements OnInit {

  posts: IPost[];
  error: string;

  constructor(
    private wpRestService: WpRestService,
    private activatedRoute: ActivatedRoute
  ) { }

  private getPosts() {

  }
  
  ngOnInit() {
    this.activatedRoute.params.forEach((params: Params) => {
      const type: 'tag'|'category'|undefined = params['type'];
      const slug: string|undefined = params['slug'];
      console.log(type, slug);

      this.wpRestService.getPosts(type, slug)
        .then(posts => {
          // console.log(posts);
          this.posts = posts;
        }, err => {
          this.error = err;
        });
    });

  }

}
