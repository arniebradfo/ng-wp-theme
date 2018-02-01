import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';


import { environment } from '../../environments/environment';
import { IWpMenuItem, IWpPost, IWpPage, IWpTaxonomy, IWpUser, IWpComment, IWpOptions, IWpId, IWpMedia } from '../interfaces/wp-rest-types';

@Injectable()
export class WpRestService {

  private _wpDomain: string = environment.wpBase;
  private _wpRest: string = this._wpDomain + 'wp-json/wp/v2/';
  private _wpMenus: string = this._wpDomain + 'wp-json/wp-api-menus/v2/';
  private _ngWp: string = this._wpDomain + 'wp-json/ngwp/v2/';

  public posts: Promise<IWpPost[]>;
  private _postsById: Promise<IWpPost[]>;

  public pages: Promise<IWpPage[]>;
  private _pagesById: Promise<IWpPage[]>;

  public media: Promise<IWpMedia[]>;
  private _mediaById: Promise<IWpMedia[]>;

  public tags: Promise<IWpTaxonomy[]>;
  private _tagsById: Promise<IWpTaxonomy[]>;

  public categories: Promise<IWpTaxonomy[]>;
  private _categoriesById: Promise<IWpTaxonomy[]>;

  public users: Promise<IWpUser[]>;
  private _usersById: Promise<IWpUser[]>;

  public options: Promise<IWpOptions>;

  constructor(
    private http: Http,
  ) {
    console.time('WpRestService');

    // generate all properties.
    this.refreshOptions();
    this.refreshTags();
    this.refreshCategories();
    this.refreshUsers();
    this.refreshMedia();

    this.refreshPosts();
    this.refreshPages();

    Promise.all([
      this.posts,
      this.pages,
      this.media,
      this.tags,
      this.categories,
      this.users,
      this.options
    ]).then(res => console.timeEnd('WpRestService'));
  }

  public refreshPosts(): void {
    this.posts = this.requestType('posts');
    this.posts = Promise.all([this.posts, this._mediaById, this._tagsById, this._categoriesById, this._usersById]).then(res => {
      // TODO: reorder so sticky posts are at the top
      const posts = res[0];
      const mediaById = res[1];
      const tagsById = res[2];
      const categoriesById = res[3];
      const usersById = res[4];
      posts.forEach(post => {
        post.tags_ref = [];
        post.categories_ref = [];
        post.tags.forEach(tagId => post.tags_ref.push(tagsById[tagId]));
        post.categories.forEach(categoryId => post.categories_ref.push(categoriesById[categoryId]));
        post.author_ref = usersById[post.author];
        post.featured_media_ref = mediaById[post.featured_media];
        post = this.tryConvertingDates(post);
      });
      return posts;
    });
    this._postsById = <Promise<IWpPost[]>>this.orderById(this.posts);
  }
  public refreshPages(): void {
    this.pages = this.requestType('pages');
    this.pages = Promise.all([this.pages, this._mediaById, this._usersById]).then(res => {
      const pages = res[0];
      const mediaById = res[1];
      const usersById = res[2];
      pages.forEach(page => {
        page.author_ref = usersById[page.author];
        page.featured_media_ref = mediaById[page.featured_media];
        page = this.tryConvertingDates(page);
      });
      return pages;
    });
    this._pagesById = <Promise<IWpPage[]>>this.orderById(this.pages);
  }
  public refreshTags(): void {
    this.tags = this.requestType('tags');
    this._tagsById = <Promise<IWpTaxonomy[]>>this.orderById(this.tags);
  }
  public refreshCategories(): void {
    this.categories = this.requestType('categories');
    this._categoriesById = <Promise<IWpTaxonomy[]>>this.orderById(this.categories);
  }
  public refreshUsers(): void {
    this.users = this.requestType('users');
    this._usersById = <Promise<IWpUser[]>>this.orderById(this.users);
  }
  public refreshMedia(): void {
    this.media = this.requestType('media');
    this.media = Promise.all([this.media, this._usersById]).then(res => {
      const medias = res[0];
      const usersById = res[1];
      medias.forEach(media => {
        media.author_ref = usersById[media.author];
        media = this.tryConvertingDates(media);
      });
      return medias;
    });
    this._mediaById = <Promise<IWpMedia[]>>this.orderById(this.media);
  }

  private orderById(promise: Promise<IWpId[]>): Promise<IWpId[]> {
    return promise.then(items => {
      const itemsById: (IWpId | undefined)[] = [];
      items.forEach(item => itemsById[item.id] = item);
      return itemsById;
    });
  }

  public requestType(type: string): Promise<any> {
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

  private tryConvertingDates<T>(obj: T): T {
    const item: any = obj;
    if (item.date) item.date = new Date(item.date);
    if (item.date_gmt) item.date_gmt = new Date(item.date_gmt);
    if (item.modified) item.modified = new Date(item.modified);
    if (item.modified_gmt) item.modified_gmt = new Date(item.modified_gmt);
    return item;
  }

  public getPostOrPage(slug: string): Promise<IWpPage | undefined> {
    return Promise.all([this.posts, this.pages]).then(res => {
      for (let i = 0; i < res.length; i++)
        for (let j = 0; j < res[i].length; j++)
          if (slug === res[i][j].slug)
            return res[i][j];
      return undefined;
    });
  }

  public getAdjcentPosts(slug: string): Promise<{
    previous: IWpPost | undefined;
    next: IWpPost | undefined;
  }> {
    return this.posts.then(posts => {
      let previous, next;
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        if (post.slug === slug) {
          previous = i > 0 ? posts[i - 1] : posts[posts.length - 1];
          next = i < posts.length - 1 ? posts[i + 1] : posts[0];
        }
      }
      return {
        previous: previous,
        next: next
      };
    });
  }

  public getPosts(type?: 'tag' | 'category' | 'author' | 'search', slug?: string): Promise<(IWpPage | IWpPost)[]> {

    if (type == null || slug == null) return this.posts;

    let prop: string;
    let set: Promise<(IWpUser | IWpTaxonomy)[]>;
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
            return posts.concat(<IWpPost[]>pages);
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

  public getMenu(name: string): Observable<IWpMenuItem[]> {
    return this.http
      .get(this._wpMenus + `menu-locations/${name}`)
      .map((res: Response) => res.json())
      .catch((err: Response | any) => {
        console.error(err);
        return Observable.throw(this.checkForMenuApiErr(err));
      });
  }

  public refreshOptions(): void {
    this.options = this.http
      .get(this._ngWp + `options`)
      .map((res: Response) => res.json())
      .catch((err: Response | any) => {
        console.error(err);
        return Observable.throw(err);
      })
      .toPromise();
    this.options.then(options => console.log('options', options));
  }

  public getComments(post: IWpPage): Promise<IWpComment[]> {
    // maybe save the comments somehow?
    // console.log(post._links.replies[0].href);

    const commentsRequest: Promise<IWpComment[]> = this.http
      .get(post._links.replies[0].href + '&per_page=100')
      .map((res: Response) => res.json())
      .catch((err: Response | any) => {
        console.error(err);
        return Observable.throw(err);
      })
      .toPromise();

    return Promise.all([commentsRequest, this._usersById]).then(res => {
      const comments = res[0];
      const usersById = res[1];
      comments.forEach(comment => {
        comment.author_ref = usersById[comment.author];
        comment = this.tryConvertingDates(comment);
      });
      return comments;
    });
  }

  public postComment(comment: IWpComment): void {

    this.options.then(options => {

      console.log(options.nonce);

      // https://stackoverflow.com/a/42352967/5648839
      // const headers: RequestOptionsArgs = {
      //   headers: new Headers({
      //     'X-WP-Nonce': options.nonce,
      //     // 'Access-Control-Allow-Headers': Authorization, Content-Type
      //   })
      // };

      const body = {
        // author: comment.author,
        author_email: 'arniebradfo@gmail.com',
        // author_ip: '',
        author_name: comment.author_name,
        // author_url: comment.author_url,
        // author_user_agent: window.navigator.userAgent,
        content: { raw: 'this is another test comment' },
        // date:	new Date(Date.now()).toLocaleString()
        date_gmt: new Date(Date.now()).toISOString(),
        parent: comment.id,
        post: comment.post,
        // status: 'approved', // ???
        // meta:	[]
      };

      this.http.post(this._wpRest + 'comments', body)
        .map((res: Response) => res.json())
        .toPromise()
        .then(res => {
          console.log(res);
        }, err => console.log(err));
    });
  }

}
