import { TreeEditor } from '@eclipse-emfcloud/theia-tree-editor';

export namespace DeploymentModel {
    export namespace Type {
        export const Service = 'Service';
        export const CloudProvider = 'CloudProvider';
        export const Container = 'Container';
        export const Deployment = 'Deployment';
        export const ServiceConfig = 'ServiceConfig';
        
        export function name(type: string): string {
            return type;
        }
    }

    const components = [
        Type.Service,
    ];

    /** Maps types to their creatable children */
    export const childrenMapping: Map<string, TreeEditor.ChildrenDescriptor[]> = new Map([
        [
            Type.Deployment, [
                {
                    property: 'children',
                    children: components
                }
            ]
        ]
    ]);

}
