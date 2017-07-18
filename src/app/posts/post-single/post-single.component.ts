import {
  Component,
  OnInit,
  ViewChild,
  ComponentFactoryResolver,
  ViewContainerRef,
  AfterViewInit,
  ComponentFactory,
  ReflectiveInjector,
  ElementRef
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Post } from '../post';
import { PostsService } from '../posts.service';
import { PostContentResolverService } from '../post-content-resolver.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ShortcodeComponent } from '../../shortcodes/shortcode/shortcode.component';

@Component({
  selector: 'app-post-single',
  templateUrl: './post-single.component.html',
  styleUrls: ['./post-single.component.css'],
  providers: [PostsService]
})
export class PostSingleComponent implements OnInit {

  post: any;
  error: any;
  content: any;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver,
    private postContentResolverService: PostContentResolverService,
    private elRef: ElementRef,
    private domSanitizer: DomSanitizer
  ) { }

  getPost(slug) {
    this.postsService
      .getPost(slug)
      .subscribe((res) => {
        // success
        this.post = res[0];

        const template = document.createElement('template');
        template.innerHTML = this.post.content.rendered;

        const factory = this.componentFactoryResolver.resolveComponentFactory(ShortcodeComponent);
        const injector = ReflectiveInjector.resolveAndCreate([]);



        console.log(template);
        console.log(template.content.querySelector('app-shortcode'));
        

        // const component = factory.create(injector, [], this.elRef.nativeElement.querySelector('#test'));
        const component = factory.create(injector, [], template.content.querySelector('app-shortcode'));

        console.log(component);

        component.instance.input = 'yay';

        this.content = this.domSanitizer.bypassSecurityTrustHtml(template.innerHTML);

        // http://blog.rangle.io/dynamically-creating-components-with-angular-2/
        // https://netbasal.com/dynamically-creating-components-with-angular-a7346f4a982d


        // let component = this.postContentResolverService.createDynamicComponent(this.post.content.rendered);
        // let componentFactory = this.postContentResolverService.createAdHocComponentFactory(component);
        // let componentRef = this.content.createComponent(componentFactory);

        // this.postContentResolverService.createComponentFactory(this.post.content.rendered)
        //   .then((factory: ComponentFactory<IHaveDynamicData>) => {
        //       // Target will instantiate and inject component (we'll keep reference to it)
        //       const componentRef = this.content.createComponent(factory);

        //       // let's inject @Inputs to component instance
        //       // let component = this.componentRef.instance;

        //       // component.entity = this.entity;
        //       // //...
        //       componentRef.changeDetectorRef.detectChanges();
        //   });

      }, (err) => {
        // error
        this.error = err;
      });
  }

  ngOnInit() {

    this.route.params.forEach((params: Params) => {
      let slug = params['slug'];
      this.getPost(slug);
    });

  }

}
