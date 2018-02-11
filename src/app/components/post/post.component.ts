import {
  Component,
  OnInit,
} from '@angular/core';
import { IWpPost, IWpPage, IWpComment, IWpError } from 'app/interfaces/wp-rest-types';
import { WpRestService } from 'app/services/wp-rest.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngwp-post',
  templateUrl: './post.component.html',
})
export class PostComponent implements OnInit {

  public post: IWpPage | IWpPost;
  public adjcentPosts: { next: IWpPost; previous: IWpPost; };
  public postContent: string;
  public errorMessage: string;

  public comments: IWpComment[];
  private allComments: IWpComment[];
  private commentsPerPage: number;
  private commentsPageNumber: number;
  public commentsPageCount: number[];
  public rootCommentFormOpen: boolean = true;

  public password: string;
  public showPasswordForm: boolean = false;

  constructor(
    private wpRestService: WpRestService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    // const params = this.activatedRoute.snapshot.params;
    this.activatedRoute.params.forEach(params => {
      this.commentsPageNumber = +params['commentsPageNumber'] || 1;
      const slug = params['slug'];
      this.getPost(slug);
    });
  }

  public openCommentReply(comment: IWpComment): void {
    this.closeAllCommentForms();
    comment.formOpen = true;
  }

  public closeCommentReply(comment: IWpComment): void {
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
      const comments = this.allComments = res[0];

      const options = res[1];
      this.commentsPerPage = options.reading.posts_per_page;
      this.commentsPageCount = Array(Math.ceil(comments.length / this.commentsPerPage)).fill(0);

      const lowerIndex = this.commentsPerPage * (this.commentsPageNumber - 1);
      const upperIndex = this.commentsPerPage * this.commentsPageNumber;
      this.comments = comments.slice(lowerIndex, upperIndex);
    });
  }

}
