import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from '../../environments/environment';
import { IMenuItem, IPost } from '../interfaces/wp-rest-types';

@Injectable()
export class WpRestService {

  private _wpDomain: string = environment.wpBase;
  private _wpRest: string = this._wpDomain + 'wp-json/wp/v2/';
  private _wpMenus: string = this._wpDomain + 'wp-json/wp-api-menus/v2/';
  private _wpSlug: string = this._wpDomain + 'wp-json/slug/';

  public posts: Promise<IPost[]>;
  public pages: Promise<any[]>; // TODO: make IPage, same as IPost?
  public tags: Promise<any[]>; // TODO: make ITag
  public categories: Promise<any[]>; // TODO: make ICategory
  public users: Promise<any[]>; // TODO: make IAuthor

  constructor(
    private http: Http,
  ) {
    // generate all properties.
    this.refreshPosts();
    this.refreshPages();
    this.refreshTags();
    this.refreshCategories();
    this.refreshUsers();
  }

  public refreshPosts(): void {
    this.posts = this.requestType('posts');
  }
  public refreshPages(): void {
    this.pages = this.requestType('pages');
  }
  public refreshTags(): void {
    this.tags = this.requestType('tags');
  }
  public refreshCategories(): void {
    this.categories = this.requestType('categories');
  }
  public refreshUsers(): void {
    this.users = this.requestType('users');
  }

  public requestType(type): Promise<any> {
    let store = [];
    return new Promise((resolve, reject) => {
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
              console.log(type, store);
              resolve(store);
            }
          });
      };
      requestPostSet();
    });
  }

  public getPostOrPage(slug: string): Promise<IPost | false> {
    return Promise.all([this.posts, this.pages]).then(res => {
      for (let i = 0; i < res.length; i++)
        for (let j = 0; j < res[i].length; j++)
          if (slug === res[i][j].slug) return res[i][j];
      return false;
    });
  }

  public getPosts(type?: 'tag'|'category'|'author'|'search', slug?: string): Promise<IPost[]> {

    if (type == undefined || slug == undefined) return this.posts;

    let prop: string;
    let set: Promise<any[]>;
    switch (type) {
      case 'tag':
        prop = 'tags';
        set = this.tags;
        break;
      case 'category':
        prop = 'categories';
        set = this.categories;
        break;
      case 'author':
        prop = 'author';
        set = this.users;
        break;
      case 'search':
        return Promise.all([this.posts, this.pages])
          .then(res => {
            let posts = res[0];
            let pages = res[1];
            const searchTerm = new RegExp(slug, 'i');
            posts = posts.filter(post => {
              return searchTerm.test(post.content.rendered) || searchTerm.test(post.title.rendered);
            });
            pages = pages.filter(page => {
              return searchTerm.test(page.content.rendered) || searchTerm.test(page.title.rendered);
            });
            return posts.concat(pages);
          });
    }

    return Promise.all([this.posts, set])
      .then(res => {
        const posts = res[0];
        const items: any[] = res[1];
        const matchingItem = items.find(item => {
          return item.slug === slug;
        });
        const itemId: number = matchingItem.id;
        return posts.filter(post => {
          if (type === 'author')
            return post.author === itemId;
          else
            return post[prop].includes(itemId);
        });
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
