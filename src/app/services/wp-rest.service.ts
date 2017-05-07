import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from '../../environments/environment';
import { IMenu, IPost } from '../interfaces/wp-rest-types';

@Injectable()
export class WpRestService {

  private _wpDomain: string = environment.wpBase;
  private _wpRest: string = this._wpDomain + 'wp-json/wp/v2/';
  private _wpMenus: string = this._wpDomain + 'wp-json/wp-api-menus/v2/';


  constructor(
    private http: Http,
  ) { }

  public getPosts(): Observable<IPost[]> {
    return this.http
      .get(this._wpRest + 'posts')
      .map((res: Response) => res.json())
      .catch((err: Response | any) => {
        console.error(err);
        return Observable.throw(err);
      });
  }

  public getPost(slug): Observable<IPost> {
    return this.http
      .get(this._wpRest + `posts?slug=${slug}`)
      .map((res: Response) => res.json())
      .catch((err: Response | any) => {
        console.error(err);
        return Observable.throw(err);
      });
  }

  private checkForMenuApiErr(err: Response | any): string | any {
      if (err._body && err._body.match(/^[\{\{]/i)) {
        const errJson = err.json();
        if (errJson.code && errJson.code === `rest_no_route`) {
          return errJson.message + `
            The menu API requires the 'WP API Menus' plugin to be installed and activated. 
            https://wordpress.org/plugins/wp-api-menus/`;
        }
      }
      return err;
  }

  public getMenu(name: string): Observable<IMenu> {
    return this.http
      .get(this._wpMenus + `menu-locations/${name}`)
      .map((res: Response) => res.json())
      .catch((err: Response | any) => {
        console.error(err);
        return Observable.throw(this.checkForMenuApiErr(err));
      });
  }

}
