// based on: https://github.com/wardbell/ng-dynamic-app/blob/master/src/app/embedded/embedded.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExampleTwoComponent, ExampleComponent } from './example/example.component';
// Any components or services used inside embedded components
// must be declared or imported here.
// It is not enough just to import them inside the AppModule

/** Components that can be embedded in docs such as CodeExampleComponent */
export const embeddableComponents: any[] = [
  ExampleTwoComponent,
  ExampleComponent,
];

/** Injectable service that returns embeddable components */
export class EmbeddableComponentsService {
  components = embeddableComponents;
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    embeddableComponents,
    // non-embedded components that are used by embeddable components
  ],
  providers: [
    EmbeddableComponentsService,
    // other services needed only by these components
  ],
  entryComponents: [ embeddableComponents ]
})
export class ShortcodesModule { }

