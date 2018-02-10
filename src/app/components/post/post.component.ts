import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  ViewContainerRef,
  AfterViewInit,
  ElementRef,
  Renderer2,
  ApplicationRef,
  Injector,
  EmbeddedViewRef,
  OnDestroy
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IWpPost, IWpPage, IWpComment, IWpError } from 'app/interfaces/wp-rest-types';
import { WpRestService } from 'app/services/wp-rest.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'ngwp-post',
  templateUrl: './post.component.html',
})
export class PostComponent implements OnInit {

  post: IWpPage | IWpPost;
  comments: IWpCommentExtended[];
  allComments: IWpCommentExtended[];
  error: any;
  postContent: SafeHtml;
  adjcentPosts: { next: IWpPost; previous: IWpPost; };
  commentsPerPage: number;
  commentsPageCount: number[];
  commentsPageNumber: number;
  rootCommentFormOpen: boolean = true;
  password: string;
  showPasswordForm: boolean = false;
  errorMessage: string;

  constructor(
    private wpRestService: WpRestService,
    private activatedRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private componentFactoryResolver: ComponentFactoryResolver,
    private renderer: Renderer2,
    private injector: Injector,
    private applicationRef: ApplicationRef
  ) { }

  ngOnInit() {
    // const params = this.activatedRoute.snapshot.params;
    this.activatedRoute.params.forEach(params => {
      this.commentsPageNumber = +params['commentsPageNumber'] || 1;
      const slug = params['slug'];
      this.getPost(slug);
    });
  }

  public openCommentReply(comment: IWpCommentExtended): void {
    this.closeAllCommentForms();
    comment.formOpen = true;
  }

  public closeCommentReply(comment: IWpCommentExtended): void {
    comment.formOpen = false;
    this.rootCommentFormOpen = true;
  }

  public closeAllCommentForms(): void {
    this.rootCommentFormOpen = false;
    this.allComments.forEach(comment => comment.formOpen = false);
  }

  public getPost(slug) {
    this.wpRestService
      .getPostOrPage(slug)
      .then(post => {
        if (!post) return;

        this.post = post;
        // console.log('current post', this.post); // for debug

        if (post.type === 'post')
          this.wpRestService.getAdjcentPosts(slug)
            .then(posts => this.adjcentPosts = posts);

        if (this.post.content.protected)
          this.showPasswordForm = true;
        else
          this.getPostContent();

      });
  }

  public onSubmit(): void {
    this.wpRestService.getPasswordProtected(this.post.id, this.password)
      .then(post => {
        this.showPasswordForm = false;
        this.getPostContent();
      }, (err: IWpError) => {
        this.errorMessage = err.message;
        // TODO: show try again message
      });
  }

  public getPostContent(): void {

    this.postContent = this.post.content.rendered;

    Promise.all([
      this.wpRestService.getComments(this.post, this.password),
      this.wpRestService.options
    ]).then(res => {
      this.allComments = res[0];
      const comments = this.generateCommentHeiarchy(this.allComments);

      const options = res[1];
      this.commentsPerPage = options.reading.posts_per_page;
      this.commentsPageCount = Array(Math.ceil(comments.length / this.commentsPerPage)).fill(0);

      const lowerIndex = this.commentsPerPage * (this.commentsPageNumber - 1);
      const upperIndex = this.commentsPerPage * this.commentsPageNumber;
      this.comments = comments.slice(lowerIndex, upperIndex);
    });
  }

  private generateCommentHeiarchy(comments: IWpCommentExtended[]): IWpCommentExtended[] {
    // TODO: test this more, move to rest service
    comments.forEach(comment => comment.children = []);
    comments.forEach(comment => {
      if (comment.parent === 0) return;
      comments.find(parentComment => {
        return parentComment.id === comment.parent;
      }).children.push(comment);
    });
    comments = comments.filter(comment => comment.parent === 0);
    return comments;
  }

}

interface IWpCommentExtended extends IWpComment {
  children?: IWpCommentExtended[];
  formOpen?: boolean;
}
