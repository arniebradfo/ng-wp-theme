import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from '../../environments/environment';
import { IMenuItem, IPost } from '../interfaces/wp-rest-types';
import { Promise } from 'q';

@Injectable()
export class WpRestService {

  private _wpDomain: string = environment.wpBase;
  private _wpRest: string = this._wpDomain + 'wp-json/wp/v2/';
  private _wpMenus: string = this._wpDomain + 'wp-json/wp-api-menus/v2/';
  private _wpSlug: string = this._wpDomain + 'wp-json/slug/';

  public posts: Promise<IPost[]>;
  public pages: Promise<IPost[]>;
  public tags: Promise<any[]>;
  public categories: Promise<any[]>;
  public settings: Promise<{}>;

  constructor(
    private http: Http,
  ) {
    // generate all properties.
    this.refreshPosts();
    this.refreshPages();
    this.refreshTags();
    this.refreshCategories();
    this.refreshSettings();
  }

  public refreshPosts(): void {
    this.posts = this.requestType('posts');
  }
  public refreshPages(): void {
    this.pages = this.requestType('pages');
  }
  public refreshTags(): void {
    this.pages = this.requestType('tags');
  }
  public refreshCategories(): void {
    this.pages = this.requestType('categories');
  }

  public refreshSettings(): void {
    // this._settings = [];
    let store = [];
    this.settings = Promise((resolve, reject) => {
      const requestPostSet = () => {
        this.http
          .get(this._wpRest + `settings`)
          .map((res: Response) => res.json())
          .catch((err: Response | any) => {
            console.error(err);
            reject(err);
            return Observable.throw(err);
          })
          .subscribe((res: any[]) => {
            store = res;
            console.log(store);
            resolve(store);
          });
      };
      requestPostSet();
    });
  }

  public requestType(type): Promise<any> {
    let store = [];
    return Promise((resolve, reject) => {
      let page = 1;
      const perPage = 100; // the max
      const requestPostSet = () => {
        this.http
          .get(this._wpRest + `${type}?per_page=${perPage}&page=${page}`)
          .map((res: Response) => res.json())
          .catch((err: Response | any) => {
            console.error(err);
            reject(err);
            return Observable.throw(err);
          })
          .subscribe((res: any[]) => {
            store = store.concat(res);
            if (res.length === perPage) {
              page++;
              requestPostSet();
            } else {
              console.log(store);
              resolve(store);
            }
          });
      };
      requestPostSet();
    });
  }

  public getPost(slug: string): Observable<IPost> {
    return this.http
      .get(this._wpSlug + slug)
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

  public getMenu(name: string): Observable<IMenuItem[]> {
    return this.http
      .get(this._wpMenus + `menu-locations/${name}`)
      .map((res: Response) => res.json())
      .catch((err: Response | any) => {
        console.error(err);
        return Observable.throw(this.checkForMenuApiErr(err));
      });
  }

}
