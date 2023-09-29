import { ILogger } from '@theia/core';
import { inject, injectable } from '@theia/core/shared/inversify';
import { DeploymentModel } from './tree-model';
import { TreeEditor } from '@eclipse-emfcloud/theia-tree-editor';
import {
    deploymentSchema,
    serviceView,
    deploymentView
} from './tree-schema';

@injectable()
export class TreeModelService implements TreeEditor.ModelService {

    constructor(
        @inject(ILogger)  readonly logger: ILogger,
    ) { }

    getDataForNode(node: TreeEditor.Node) {
        return node.jsonforms.data;
    }

    getSchemaForNode(node: TreeEditor.Node) {
        return {
            definitions: deploymentSchema.definitions,
            ...this.getSchemaForType(node.jsonforms.type),
        };
    }

    private getSchemaForType(type: string) {
        if (!type) {
            return undefined;
        }
        const schema = Object.entries(deploymentSchema.definitions)
            .map(entry => entry[1])
            .find(
                definition =>
                    definition.properties && definition.properties.typeId.const === type
            );
        if (schema === undefined) {
            this.logger.warn("Can't find definition schema for type " + type);
        }
        return schema;
    }

    getUiSchemaForNode(node: TreeEditor.Node) {
        const type = node.jsonforms.type;
        switch (type) {
            case DeploymentModel.Type.Deployment:
                return deploymentView;
            case DeploymentModel.Type.Service:
                return serviceView;
            default:
                this.logger.warn("Can't find registered ui schema for type " + type);
                return undefined;
        }
    }

    getChildrenMapping(): Map<string, TreeEditor.ChildrenDescriptor[]> {
        DeploymentModel.childrenMapping.forEach(child => child.forEach(item => item.children[0]))
        return DeploymentModel.childrenMapping;
    }

    getNameForType(type: string): string {
        return DeploymentModel.Type.name(type);
    }
}
