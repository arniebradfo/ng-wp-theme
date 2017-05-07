import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Post } from '../../interfaces/post';
import { PostsService } from '../../services/posts.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'ngwp-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  // providers: [PostsService]
})
export class PostComponent implements OnInit {

  post: any;
  error: any;

  @ViewChild('content', { read: ViewContainerRef }) content;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  getPost(slug) {
    this.postsService
      .getPost(slug)
      .subscribe((res) => {
        // success
        this.post = res[0];
        const component = this.postsService.createComponentFromString(this.post.content.rendered);
        const componentFactory = this.postsService.createDynamicComponentFactory(component);
        const componentRef = this.content.createComponent(componentFactory);
        componentRef.changeDetectorRef.detectChanges();
      }, (err) => {
        // error
        this.error = err;
      });
  }

  ngOnInit() {

    this.route.params.forEach((params: Params) => {
      const slug = params['slug'];
      this.getPost(slug);
    });

  }

}
