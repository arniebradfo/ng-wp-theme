import { ApplicationRef, ComponentFactoryResolver, Injector, ComponentRef, EmbeddedViewRef, Type, Renderer2 } from '@angular/core';

// https://stackoverflow.com/a/41950786/5648839

export class HtmlContainer {
    private attached: boolean = false;

    private disposeFn: () => void;

    constructor(
        private hostElement: Element,
        private appRef: ApplicationRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        // private renderer: Renderer2,
        private injector: Injector
    ) {}

    attach(component: Type<any>): ComponentRef<any> {
        if (this.attached) {
            throw new Error('component has already been attached');
        }

        this.attached = true;
        const childComponentFactory = this.componentFactoryResolver.resolveComponentFactory(component);

        const componentRef = childComponentFactory.create(this.injector);

        this.appRef.attachView(componentRef.hostView);
        this.disposeFn = () => {
            this.appRef.detachView(componentRef.hostView);
            componentRef.destroy();
        };

        this.hostElement.appendChild((componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0]);

        return componentRef;
    }

    dispose() {
        if (this.attached) {
            this.disposeFn();
        }
    }
}