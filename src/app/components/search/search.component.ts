import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngwp-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  search: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() { }

  onSubmit() {
    this.router.navigate([''], {
       queryParams: { s: this.search },
       relativeTo: this.activatedRoute.root
      });
  }

}
