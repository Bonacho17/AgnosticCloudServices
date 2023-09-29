import { injectable } from '@theia/core/shared/inversify';
import { LabelProviderContribution } from '@theia/core/lib/browser';
import { DeploymentModel } from './tree-model';
import { TreeEditorWidget } from './tree-editor-widget';
import { TreeEditor } from '@eclipse-emfcloud/theia-tree-editor';

const DEFAULT_COLOR = 'black';

const ICON_CLASSES: Map<string, string> = new Map([
    [DeploymentModel.Type.Service, 'fa-window-maximize ' + 'DEFAULT_COLOR'],
    [DeploymentModel.Type.CloudProvider, 'fa-arrows-alt ' + DEFAULT_COLOR],
    [DeploymentModel.Type.Container, 'fa-tv ' + DEFAULT_COLOR],
    [DeploymentModel.Type.Deployment, 'fa fa-cloud ' + DEFAULT_COLOR],
    [DeploymentModel.Type.ServiceConfig, 'fa-microchip ' + DEFAULT_COLOR]
]);

/* Icon for unknown types */
const UNKNOWN_ICON = 'fa-question-circle ' + DEFAULT_COLOR;

@injectable()
export class TreeLabelProvider implements LabelProviderContribution {

    public canHandle(element: object): number {
        if ((TreeEditor.Node.is(element) || TreeEditor.CommandIconInfo.is(element))
            && element.editorId === TreeEditorWidget.WIDGET_ID) {
            return 1000;
        }
        return 0;
    }

    public getIcon(element: object): string | undefined {

        let iconClass: string | undefined;
        if (TreeEditor.CommandIconInfo.is(element)) {
            iconClass = ICON_CLASSES.get(element.type);
        } else if (TreeEditor.Node.is(element)) {
            iconClass = ICON_CLASSES.get(element.jsonforms.type);
        }

        return iconClass ? 'fa ' + iconClass : 'fa ' + UNKNOWN_ICON;
    }

    public getName(element: object): string | undefined {
        
        const data = TreeEditor.Node.is(element) ? element.jsonforms.data : element;
        
        if (data.name) {
            return data.name;
        } else if (data.typeId) {
            return this.getTypeName(data.typeId);
        }
        return undefined;
    }

    private getTypeName(typeId: string): string {
        return DeploymentModel.Type.name(typeId);
    }
}
