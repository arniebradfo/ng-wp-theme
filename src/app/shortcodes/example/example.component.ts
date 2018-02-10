import { Component, OnInit, Input, HostBinding, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { registerComponent } from 'app/app-component-registry';

@registerComponent
@Component({
  selector: 'ngwp-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent implements OnInit {

  @Input() input: string;
  @ViewChild('content', {read: ElementRef}) htmlInsertionRef: ElementRef;

  constructor() { }

  ngOnInit() {
    console.log(this);
  }

}

@registerComponent
@Component({
  selector: 'ngwp-example-2',
  templateUrl: './example.component.html'
})
export class ExampleTwoComponent extends ExampleComponent {}

