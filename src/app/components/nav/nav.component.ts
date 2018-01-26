import { Component, OnInit, Input } from '@angular/core';
import { IWpMenuItem } from '../../interfaces/wp-rest-types';
import { WpRestService } from '../../services/wp-rest.service';

@Component({
  selector: 'ngwp-nav',
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit {

  public menu: IWpMenuItem[];
  public error: any;

  @Input() name: string;

  constructor(
    private wpRestService: WpRestService,
    // private route: ActivatedRoute, // will need this later
  ) { }

  private getMenus() {
    this.wpRestService
      .getMenu(this.name)
      .subscribe(res => {
        this.menu = res;
        // console.log(this.menu);
      }, err => {
        this.error = err;
        // console.log(this.error);
      });
  }

  ngOnInit() {
    this.getMenus();
  }

  // get the WP slug out of a url. assumes there is only one slug in the url
  parseSlug(url: string): string {
    const parsedURL = new URL(url);
    const slug = parsedURL.pathname.replace('/', '');
    return slug;
  }

}
