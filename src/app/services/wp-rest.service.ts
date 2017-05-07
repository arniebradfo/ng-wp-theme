import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from '../../environments/environment';
import { Post } from '../interfaces/post';

@Injectable()
export class WpRestService {

  private _wpBase = environment.wpBase;

  constructor(
    private http: Http,
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

}
