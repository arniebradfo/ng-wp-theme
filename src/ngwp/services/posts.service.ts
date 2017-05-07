import {
  Injectable,
  Component,
  ComponentFactoryResolver,
  ViewContainerRef,
  AfterViewInit,
  Type,
  NgModule,
  ComponentFactory,
  Compiler
} from '@angular/core';
import { NgWpModule } from '../ngwp.module';
import { CommonModule } from '@angular/common';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { environment } from '../../environments/environment';
import { Post } from '../interfaces/post';

@Injectable()
export class PostsService {

  private _wpBase = environment.wpBase;

  constructor(
    private http: Http,
    private compiler: Compiler
  ) { }

  public getPosts(): Observable<Post[]> {
      return this.http
        .get(this._wpBase + 'posts')
        .map((res: Response) => res.json())
        .catch((err: Response | any) => {
          console.error(err);
          return Observable.throw(err);
        });
  }

  public getPost(slug): Observable<Post> {
      return this.http
        .get(this._wpBase + `posts?slug=${slug}`)
        .map((res: Response) => res.json())
        .catch((err: Response | any) => {
          console.error(err);
          return Observable.throw(err);
        });
  }

  public createComponentFromString(tmpl: string): Type<any> {
    @Component({
      template: tmpl
    })
    class InsertedComponent { }
    return InsertedComponent;
  }

  public createDynamicComponentFactory(component: any): ComponentFactory<any> {
    @NgModule({
      declarations: [component],
      entryComponents: [component],
      imports: [ NgWpModule, CommonModule ],
    })
    class DynamicModule { }

    const factory = this.compiler.compileModuleAndAllComponentsSync(DynamicModule).componentFactories
      .find(fact => fact.componentType === component);
    return factory;
  }

}
