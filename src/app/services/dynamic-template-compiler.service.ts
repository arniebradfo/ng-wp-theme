import {
  Injectable,
  Component,
  Type,
  NgModule,
  ComponentFactory,
  Compiler
} from '@angular/core';
import { NgWpModule } from '../ngwp.module';
import { CommonModule } from '@angular/common';


@Injectable()
export class DynamicTemplateCompilerService {

  constructor(
    private compiler: Compiler
  ) { }

  public createComponentFromString(tmpl: string): Type<any> {
    @Component({
      template: tmpl
    })
    class InsertedComponent { }
    return InsertedComponent;
  }

  // maybe we don't need a new module?
  // TODO: ComponentFactoryResolver ? : https://angular.io/docs/ts/latest/api/core/index/ComponentFactoryResolver-class.html
  public createDynamicComponentFactory(component: any): ComponentFactory<any> {
    @NgModule({
      declarations: [component],
      entryComponents: [component],
      imports: [ NgWpModule, CommonModule ],
    })
    class DynamicModule { }

    const factory = this.compiler.compileModuleAndAllComponentsSync(DynamicModule).componentFactories
      .find(fact => fact.componentType === component);
    return factory;
  }

}
