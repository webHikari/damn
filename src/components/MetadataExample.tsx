import { Component } from 'react';
import 'reflect-metadata';

interface ComponentInfoData {
  name: string;
  description: string;
}

function ComponentInfo(info: ComponentInfoData) {
    return function <T extends { new (...args: any[]): Component }>(target: T) {
        Reflect.defineMetadata('componentInfo', info, target);
        return target;
    };
}

function LogMethod(
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value as (...args: unknown[]) => unknown;
    
    descriptor.value = function(...args: unknown[]) {
        console.log(`Calling method ${propertyKey} with args:`, args);
        return originalMethod.apply(this, args);
    };
    
    return descriptor;
}

@ComponentInfo({
  name: 'smth',
  description: 'smth #2'
})
class MetadataExample extends Component {
    @LogMethod
    handleClick(): void {
        console.log('Button clicked!');
    }
  
    render() {
        const metadata = Reflect.getMetadata('componentInfo', MetadataExample);
        const componentInfo = metadata as ComponentInfoData;
        return (
            <div>
                <button onClick={() => this.handleClick()}>Click me</button>
                <div>
                    <p>Component Info:</p>
                    <p>
                        {JSON.stringify(componentInfo, null, 2)}
                    </p>
                </div>
            </div>
        );
    }
}

export default MetadataExample; 