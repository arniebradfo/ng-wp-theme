import { Component, OnInit } from '@angular/core';
import { Post } from '../../interfaces/post';
import { PostsService } from '../../services/posts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngwp-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  // providers: [PostsService]
})
export class PostListComponent implements OnInit {

  posts: Post[];
  error: string;

  constructor( private postsService: PostsService, private router: Router ) { }

  getPosts(){
    this.postsService
      .getPosts()
      .subscribe(res => {
        // success
        this.posts = res;
      }, err => {
        // error
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
