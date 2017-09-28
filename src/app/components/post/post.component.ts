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
  EmbeddedViewRef
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IPost } from '../../interfaces/wp-rest-types';
import { WpRestService } from '../../services/wp-rest.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { COMPONENTREGISTRY } from 'app/app-component-registry';
import { HtmlContainer } from 'app/services/html-container';

// insert component anywhere:
// https://stackoverflow.com/a/41950786/5648839

@Component({
  selector: 'ngwp-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  // providers: [WpRestService]
})
export class PostComponent implements OnInit {

  post: any; //: IPost;
  error: any;
  postContent: SafeHtml;

  @ViewChild('content', { read: ViewContainerRef }) contentViewContainerRef: ViewContainerRef;
  @ViewChild('content', { read: ElementRef }) content: ElementRef;

  constructor(
    private wpRestService: WpRestService,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private componentFactoryResolver: ComponentFactoryResolver,
    private renderer: Renderer2,
    private injector: Injector,
    private applicationRef: ApplicationRef
  ) { }

  getPost(slug) {
    this.wpRestService
      .getPost(slug)
      .subscribe((response) => {
        this.post = response[0];
        this.postContent = this.domSanitizer.bypassSecurityTrustHtml(this.post.content.rendered);

        window.setTimeout(() => {
          const componentSet = this.content.nativeElement.querySelectorAll('[data-component]');

          // foreach in componentSet
          const node = componentSet[0];
          const component = COMPONENTREGISTRY.getTypeFor(componentSet[0].dataset.component);
          const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
          const componentRef = componentFactory.create(this.injector);
          this.applicationRef.attachView(componentRef.hostView);
          const disposeComponentRef = () => {
            this.applicationRef.detachView(componentRef.hostView);
            componentRef.destroy();
          };
          this.renderer.insertBefore(node.parentNode, (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0], node);
          this.renderer.removeChild(node.parentNode, node);

        }, 0);

      }, (error) => {
        this.error = error;
      });
  }

  ngOnInit() {

    this.route.params.forEach((params: Params) => {
      const slug = params['slug'];
      this.getPost(slug);
    });

  }

}
