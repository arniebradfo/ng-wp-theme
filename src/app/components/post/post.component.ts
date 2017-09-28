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
export class PostComponent implements OnInit, OnDestroy {

  post: any; // : IPost;
  error: any;
  postContent: SafeHtml;

  destroyDynamicComponents:  (() => void)[] = [];

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

          // need to find the lowest first
          for (let i = 0; i < componentSet.length; i++) {
            const node: Node = componentSet[i];
            const component = COMPONENTREGISTRY.getTypeFor(componentSet[0].dataset.component);
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
            const componentRef = componentFactory.create(this.injector);
            this.applicationRef.attachView(componentRef.hostView);
            this.destroyDynamicComponents.push(() => {
              this.applicationRef.detachView(componentRef.hostView);
              componentRef.destroy();
            });

            const componentRoot: HTMLElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0];
            this.renderer.insertBefore(node.parentNode, componentRoot, node);

            for (let j = 0; j < node.attributes.length; j++) {
              const attr = node.attributes.item(j);
              (<any>componentRef.instance)[attr.name] = attr.value; // maybe use eval()
              this.renderer.setAttribute(componentRoot, attr.name, attr.value);
            }
            this.renderer.removeChild(node.parentNode, node);
          }
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

  ngOnDestroy() {
    this.destroyDynamicComponents.forEach(destroyDynamicComponent => destroyDynamicComponent());
  }

}
