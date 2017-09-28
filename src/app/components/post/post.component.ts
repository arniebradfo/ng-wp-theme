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
  Injector
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IPost } from '../../interfaces/wp-rest-types';
import { WpRestService } from '../../services/wp-rest.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { COMPONENTREGISTRY } from 'app/app-component-registry';
import { HtmlContainer } from 'app/services/html-container';

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
      .subscribe((res) => {
        // success
        this.post = res[0];
        this.postContent = this.domSanitizer.bypassSecurityTrustHtml(this.post.content.rendered);

        // let container = this.renderer.createElement('div');
        // this.renderer.setProperty(container, 'innerHTML', this.post.content.rendered);

        window.setTimeout(() => {
          const componentSet = this.content.nativeElement.querySelectorAll('[data-component]');

          console.log(componentSet);
          // foreach in componentSet
          const node = componentSet[0];
          const nodeIndex = [].indexOf.call(node.parentNode.childNodes, node);
          console.log(nodeIndex);

          let container = new HtmlContainer(node, this.applicationRef, this.componentFactoryResolver, this.injector);
          let component = COMPONENTREGISTRY.getTypeFor(componentSet[0].dataset.component);
          let componentRef = container.attach(component);


          // let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
          // this.contentViewContainerRef.createComponent(componentFactory, nodeIndex);


        }, 0);


        // this.content.nativeElement.innerHTML = this.post.content.rendered; // this doesn't render in JIT

        // const component = this.dynamicTemplateCompilerService.createComponentFromString(this.post.content.rendered);
        // const componentFactory = this.dynamicTemplateCompilerService.createDynamicComponentFactory(component);
        // // TODO: research ViewContainerRef.createEmbeddedView();
        // const componentRef = this.content.createComponent(componentFactory);

        // componentRef.changeDetectorRef.detectChanges();
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
