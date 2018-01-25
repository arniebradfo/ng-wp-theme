import {
  Component,
  OnInit,
  ViewChild,
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
import { IWpPost, IWpPage, IWpComment } from '../../interfaces/wp-rest-types';
import { WpRestService } from '../../services/wp-rest.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { COMPONENTREGISTRY } from 'app/app-component-registry';

// insert component anywhere:
// https://stackoverflow.com/a/41950786/5648839

@Component({
  selector: 'ngwp-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  // providers: [WpRestService]
})
export class PostComponent implements OnInit, OnDestroy {


  post: IWpPage; // : IPost;
  comments: IWpComment[];
  error: any;
  postContent: SafeHtml;

  destroyDynamicComponents:  (() => void)[] = [];

  @ViewChild('content', { read: ViewContainerRef }) contentViewContainerRef: ViewContainerRef;
  @ViewChild('content', { read: ElementRef }) content: ElementRef;

  constructor(
    private wpRestService: WpRestService,
    private activatedRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private componentFactoryResolver: ComponentFactoryResolver,
    private renderer: Renderer2,
    private injector: Injector,
    private applicationRef: ApplicationRef
  ) { }

  public getPost(slug) {
    this.wpRestService
      .getPostOrPage(slug)
      .then((response) => {
        if (!response) return;
        this.post = response;
        this.postContent = this.domSanitizer.bypassSecurityTrustHtml(this.post.content.rendered);

        this.wpRestService.getComments(this.post)
          .then(comments => {
            this.comments = this.generateCommentHeiarchy(comments);
            console.log(this.comments);
          });

        window.setTimeout(() => { this.renderComponents(); }, 0);

      }, (error) => {
        this.error = error;
      });
  }

  private generateCommentHeiarchy(comments: IWpComment[]): IWpComment[] {
    // TODO: test this more
    comments.forEach(comment => comment.children = []);
    comments.forEach(comment => {
      if (comment.parent === 0) return;
      comments.find(parentComment => {
        return parentComment.id === comment.parent;
      }).children.push(comment);
    });
    comments = comments.filter(comment => comment.parent === 0 );
    return comments;
  }

  ngOnInit() {
    this.activatedRoute.params.forEach((params: Params) => {
      const slug = params['slug'];
      this.getPost(slug);
    });
  }

  ngOnDestroy() {
    this.destroyDynamicComponents.forEach(destroyDynamicComponent => destroyDynamicComponent());
  }

  renderComponents(): any {
    const componentSet = this.content.nativeElement.querySelectorAll('[data-component]');

    // TODO: need to find the highest first? test with nested elements
    for (let i = 0; i < componentSet.length; i++) {

      // get the un-angular element and make it an angular component
      const node: Node = componentSet[i];
      const component = COMPONENTREGISTRY.getTypeFor(componentSet[0].dataset.component);
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
      const componentRef = componentFactory.create(this.injector);
      this.applicationRef.attachView(componentRef.hostView);
      this.destroyDynamicComponents.push(() => {
        this.applicationRef.detachView(componentRef.hostView);
        componentRef.destroy();
      });

      // insert the Angualr component
      const componentRoot: HTMLElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0];
      this.renderer.insertBefore(node.parentNode, componentRoot, node);

      // add attributes to the html element and properties to the component class
      for (let j = 0; j < node.attributes.length; j++) {
        const attr = node.attributes.item(j);
        (<any>componentRef.instance)[attr.name] = attr.value; // maybe use eval()
        this.renderer.setAttribute(componentRoot, attr.name, attr.value);
      }

      // add all the children to the new component element
      while (node.childNodes.length > 0) {
        // TODO: write an inteface for this
        this.renderer.appendChild(
          (<any>componentRef.instance).htmlInsertionRef.nativeElement.parentNode,
          node.childNodes[0]
        );
      }

      // remove the old component
      this.renderer.removeChild(node.parentNode, node);
    }
}

}
