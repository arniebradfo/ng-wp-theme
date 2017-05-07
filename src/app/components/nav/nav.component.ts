import { Component, OnInit, Input } from '@angular/core';
import { IMenu } from '../../interfaces/wp-rest-types';
import { WpRestService } from '../../services/wp-rest.service';

@Component({
  selector: 'ngwp-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public menu: IMenu;
  public menuContext;
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
        this.menuContext = { menu: this.menu };
        console.log(this.menu);
      }, err => {
        this.error = err;
        console.log(this.error);
      });
  }

  ngOnInit() {
    this.getMenus();
  }

}
