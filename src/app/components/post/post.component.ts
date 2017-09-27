import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef, AfterViewInit, ElementRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IPost } from '../../interfaces/wp-rest-types';
import { WpRestService } from '../../services/wp-rest.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { COMPONENTREGISTRY } from 'app/app-component-registry';

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

  @ViewChild('content', { read: ViewContainerRef }) contentRef: ViewContainerRef;
  @ViewChild('content', { read: ElementRef }) contentEl: ElementRef;

  constructor(
    private wpRestService: WpRestService,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  getPost(slug) {
    this.wpRestService
      .getPost(slug)
      .subscribe((res) => {
        // success
        this.post = res[0];
        this.postContent = this.domSanitizer.bypassSecurityTrustHtml(this.post.content.rendered);
        console.log(this.post.content.rendered);
        console.log(this.contentRef, this.contentEl);

        window.setTimeout(() => {
          const componentSet = this.contentEl.nativeElement.querySelectorAll('[data-component]');
          console.log(componentSet);

          // foreach in componentSet
          const node = componentSet[0];
          const nodeIndex = [].indexOf.call(node.parentNode.childNodes, node);
          console.log(nodeIndex);

          let component = COMPONENTREGISTRY.getTypeFor(componentSet[0].dataset.component);
          let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
          this.contentRef.createComponent(componentFactory, 0);

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
