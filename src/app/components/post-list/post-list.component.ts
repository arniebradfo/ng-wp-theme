import { Component, OnInit } from '@angular/core';
import { IPost } from '../../interfaces/wp-rest-types';
import { WpRestService } from '../../services/wp-rest.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) { }

  private getPosts() {
    this.wpRestService.posts
      .then(posts => {
        // console.log(posts);
        this.posts = posts;
      }, err => {
        this.error = err;
      });
  }

  ngOnInit() {
    this.getPosts();
  }

}
