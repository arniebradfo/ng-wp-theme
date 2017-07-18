import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IPost } from '../../interfaces/wp-rest-types';
import { WpRestService } from '../../services/wp-rest.service';
import { DynamicTemplateCompilerService } from '../../services/dynamic-template-compiler.service'
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'ngwp-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  // providers: [WpRestService]
})
export class PostComponent implements OnInit {

  post: any; //: IPost;
  error: any;

  @ViewChild('content', { read: ViewContainerRef }) content;

  constructor(
    private wpRestService: WpRestService,
    private route: ActivatedRoute,
    private dynamicTemplateCompilerService: DynamicTemplateCompilerService
  ) { }

  getPost(slug) {
    this.wpRestService
      .getPost(slug)
      .subscribe((res) => {
        // success
        this.post = res[0];

        // console.log(this.post.content.rendered);
        // console.log(this.content.nativeElement);
        // this.content.nativeElement.innerHTML = this.post.content.rendered; // this doesn't render in JIT

        const component = this.dynamicTemplateCompilerService.createComponentFromString(this.post.content.rendered);
        const componentFactory = this.dynamicTemplateCompilerService.createDynamicComponentFactory(component);
        // TODO: research ViewContainerRef.createEmbeddedView();
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
