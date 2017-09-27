import { Component, OnInit, Input } from '@angular/core';
import { registerComponent } from 'app/app-component-registry';

@registerComponent
@Component({
  selector: 'ngwp-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {

  @Input() input: string;

  constructor() { }

  ngOnInit() {
    console.log(this.input);
  }

}
