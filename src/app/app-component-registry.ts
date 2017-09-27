/**
 * @author http://bradford.digital
 * @link https://stackoverflow.com/questions/42949647/resolve-type-of-component-from-string-in-angular2
 *
 * Keep a registry of key:value pairs that is the string name of a component and the Component reference
 * The registry is stored in an exported const named COMPONENTREGISTRY
 * Add to the registry by using the registerComponent() function as an adorner. example:
 *     @registerComponent
 *     @Component({...})
 *     export class AnExampleComponent {...}
 * Get a component by its string name by calling COMPONENTREGISTRY.getTypeFor('AnExampleComponent')
 * Or get it by its template name if your following general angular naming convention COMPONENTREGISTRY.getTypeFor('app-an-example')
 *
 * TODO: add the html template string without guessing like we are now?
 *     A class couuld be obtained by calling COMPONENTREGISTRY.getTypeFor('app-an-example')
**/

interface Component { }

type ComponentClass = { new(...any: any[]): Component };

class ComponentRegistry {

    registry = new Map<string, ComponentClass>();

    getTypeFor(name: string): ComponentClass {
        if (name.match('-'))
            name = this.getComponentNameFromTemplate(name);
        let componentClass: ComponentClass = this.registry.get(name);
        if (componentClass == null) throw new Error(`${name} was not found in the COMPONENTREGISTRY.registry`);
        return componentClass;
    }
    getComponentNameFromTemplate(name: string): string {
        const words: string[] = name.split('-');
        words.splice(0, 1); // remove the prefix
        for (let i = 0; i < words.length; i++) {
            const capitalized = words[i].charAt(0).toUpperCase() + words[i].slice(1);
            words.splice(i, 1, capitalized);
        }
        const componentName = words.join('') + 'Component';
        return componentName;
    }

    register(cls: ComponentClass): void {
        console.dir(cls);
        this.registry.set(cls.name, cls);
    }

    // registerTemplateString(cls: ComponentClass): void {
    // 	let templateString = 'app-angular-component'; // how to get this from the ComponentClass reference?
    // 	this.registry.set(templateString, cls);
    // }

}

export const COMPONENTREGISTRY = new ComponentRegistry();

export function registerComponent(componentClass: ComponentClass): void {
    COMPONENTREGISTRY.register(componentClass);
}
