import {
  Injectable,
  Component,
  ComponentFactoryResolver,
  ViewContainerRef,
  AfterViewInit,
  Type,
  NgModule,
  ComponentFactory,
  Compiler,
  Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppModule } from '../app.module';
import { JitCompilerFactory } from '@angular/compiler';

export interface IHaveDynamicData {
    entity: any;
}

@Injectable()
export class PostContentResolverService {


  // this object is singleton - so we can use this as a cache
  private _cacheOfFactories: { [templateKey: string]: ComponentFactory<IHaveDynamicData> } = {};

  // wee need Dynamic component builder
  private compiler: Compiler = new JitCompilerFactory([{useDebug: false, useJit: true}]).createCompiler();
  // constructor(
  //   // protected compiler: JitCompiler
  // ) { }


  public createComponentFactory(template: string): Promise<ComponentFactory<IHaveDynamicData>> {

    let factory = this._cacheOfFactories[template];

    if (factory) {
      console.log('Module and Type are returned from cache');

      return new Promise((resolve) => {
        resolve(factory);
      });
    }

    // unknown template ... let's create a Type for it
    let type = this.createNewComponent(template);
    let module = this.createComponentModule(type);

    return new Promise((resolve) => {
      // this.compiler
      //   .compileModuleAndAllComponentsSync(module)
      //   .componentFactories
      //   .find(fact => fact.componentType === component);

      // return factory;

      this.compiler
        .compileModuleAndAllComponentsAsync(module)
        .then((moduleWithFactories) => {
          // factory = _
          // .find(moduleWithFactories.componentFactories, { componentType: type });
          factory = moduleWithFactories.componentFactories
            .find(fact => fact.componentType === type);

          this._cacheOfFactories[template] = factory;

          resolve(factory);
        });
    });
  }

  protected createNewComponent(tmpl: string) {
    @Component({
      template: tmpl,
    })
    class CustomDynamicComponent implements IHaveDynamicData {
      @Input() public entity: any;
    };
    // a component for this particular template
    return CustomDynamicComponent;
  }

  protected createComponentModule(componentType: any) {
    @NgModule({
      declarations: [componentType],
       imports: [ AppModule, CommonModule ],
   })
    class RuntimeComponentModule { }
    // a module for just this Type
    return RuntimeComponentModule;
  }
}
