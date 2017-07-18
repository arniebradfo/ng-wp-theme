
// this isn't going to work with AOT + JIT
// maybe parse the content, and replace recognized components with components known to the module
// NgComponentOutlet ?

// https://angular.io/docs/ts/latest/cookbook/dynamic-component-loader.html
// ViewContainerRef.createComponent()
// with projectableNodes: http://stackoverflow.com/questions/40106480/what-are-projectable-nodes-in-angular2/40323785#40323785
// and input like this: http://stackoverflow.com/a/37488028/5648839


import {
  Injectable,
} from '@angular/core';


@Injectable()
export class PostContentResolverService {

  constructor() { }

  public renderComponent(containerElement: Element) {

        // get this.post.content.rendered and DomSanatize it insert into the DOM
        

        // parse it for ng-components - use a data-ngwp attribute
        // create a view ViewContainerRef in the right place - TODO: HOW???
        // for each ngComponents - look up the component type using some json table compare to selector
        // create a component with its projectableNodes
        // insert it inplace of the old element - find the correct index
        // give it its inputs - try to push all attributes into the instance - try, catch?

  }

}
