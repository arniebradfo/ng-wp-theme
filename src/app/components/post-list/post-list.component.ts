import { Component, OnInit } from '@angular/core';
import { Post } from '../../interfaces/post';
import { WpRestService } from '../../services/wp-rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngwp-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  // providers: [WpRestService]
})
export class PostListComponent implements OnInit {

  posts: Post[];
  error: string;

  constructor( private wpRestService: WpRestService, private router: Router ) { }

  private getPosts() {
    this.wpRestService
      .getPosts()
      .subscribe(res => {
        console.log(res);
        this.posts = res;
      }, err => {
        console.log(err);
        this.error = err;
      });

  }

  ngOnInit() {
    this.getPosts();
  }

  selectPost(slug) {
    this.router.navigate([slug]);
  }

}
