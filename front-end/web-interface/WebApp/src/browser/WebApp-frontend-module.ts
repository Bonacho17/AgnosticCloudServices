import '@eclipse-emfcloud/theia-tree-editor/style/index.css';
import '@eclipse-emfcloud/theia-tree-editor/style/forms.css';
import '../../src/browser/style/editor.css';

import { CommandContribution, MenuContribution } from '@theia/core';
import { LabelProviderContribution, NavigatableWidgetOptions, OpenHandler, WidgetFactory } from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { ContainerModule } from '@theia/core/shared/inversify';
import { TreeContribution } from './tree-contribution';
import { TreeModelService } from './tree/tree-model-service';
import { TreeNodeFactory } from './tree/tree-node-factory';
import { TreeEditorWidget } from './tree/tree-editor-widget';
import { TreeLabelProvider } from './tree/tree-label-provider';
import { TreeLabelProviderContribution } from './tree-label-provider-contribution';
import { NewTreeExampleFileCommandHandler, NewTreeExampleFileCommandHandler2 } from './config-file/config-file-command';
import { NewTreeExampleFileCommandContribution, NewTreeExampleFileCommandContribution2, NewTreeExampleFileMenuContribution, NewTreeExampleFileMenuContribution2 } from './config-file/config-file-contribution';
import { createBasicTreeContainer, NavigatableTreeEditorOptions } from '@eclipse-emfcloud/theia-tree-editor';

import { MenuWidget } from './menu-widget';
import { TestContribution } from './tree-contribution';
import { bindViewContribution, FrontendApplicationContribution } from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';
import { HelloWorldCommandContribution, HelloWorldMenuContribution } from './tree-contribution';

export default new ContainerModule(bind => {

    // Bind Theia IDE contributions for the tree editor.
    bind(LabelProviderContribution).to(TreeLabelProviderContribution);
    bind(OpenHandler).to(TreeContribution);
    bind(MenuContribution).to(TreeContribution);
    bind(CommandContribution).to(TreeContribution);
    bind(LabelProviderContribution).to(TreeLabelProvider);

    // bind services to themselves because we use them outside of the editor widget, too.
    bind(TreeModelService).toSelf().inSingletonScope();
    bind(TreeLabelProvider).toSelf().inSingletonScope();

    bind<WidgetFactory>(WidgetFactory).toDynamicValue(context => ({
        id: TreeEditorWidget.WIDGET_ID,
        createWidget: (options: NavigatableWidgetOptions) => {

            const treeContainer = createBasicTreeContainer(
                context.container,
                TreeEditorWidget,
                TreeModelService,
                TreeNodeFactory
            );

            // Bind options.
            const uri = new URI(options.uri);
            treeContainer.bind(NavigatableTreeEditorOptions).toConstantValue({ uri });

            return treeContainer.get(TreeEditorWidget);
        }
    }));

    bindViewContribution(bind, TestContribution);
    bind(FrontendApplicationContribution).toService(TestContribution);
    bind(MenuWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: MenuWidget.ID,
        createWidget: () => ctx.container.get<MenuWidget>(MenuWidget)
    })).inSingletonScope();

    // add your contribution bindings here
    bind(CommandContribution).to(HelloWorldCommandContribution);
    bind(MenuContribution).to(HelloWorldMenuContribution);

    // Bind Theia IDE contributions for the example file creation menu entry.
    bind(NewTreeExampleFileCommandHandler).toSelf();
    bind(CommandContribution).to(NewTreeExampleFileCommandContribution);
    bind(MenuContribution).to(NewTreeExampleFileMenuContribution);

    bind(NewTreeExampleFileCommandHandler2).toSelf();
    bind(CommandContribution).to(NewTreeExampleFileCommandContribution2);
    bind(MenuContribution).to(NewTreeExampleFileMenuContribution2);

});
