import URI from '@theia/core/lib/common/uri';
import { CommandRegistry, MenuModelRegistry } from '@theia/core';
import { ApplicationShell, NavigatableWidgetOptions, OpenerService, WidgetOpenerOptions } from '@theia/core/lib/browser';
import { inject, injectable } from '@theia/core/shared/inversify';
import { TreeModelService } from './tree/tree-model-service';
import { TreeEditorWidget } from './tree/tree-editor-widget';
import { TreeLabelProvider } from './tree/tree-label-provider';
import { BaseTreeEditorContribution, MasterTreeWidget, TreeEditor } from '@eclipse-emfcloud/theia-tree-editor';

import { Command, CommandContribution, MessageService } from '@theia/core/lib/common';
import { CommonMenus } from '@theia/core/lib/browser';

export const HelloWorldCommand: Command = {
    id: 'HelloWorld.command',
    label: 'Say Hello'
};

import { MenuContribution } from '@theia/core';
@injectable()
export class HelloWorldCommandContribution implements CommandContribution {

    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(HelloWorldCommand, {
            execute: () => this.messageService.info('Hello World!')
        });
    }
}

@injectable()
export class HelloWorldMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.EDIT_FIND, {
            commandId: HelloWorldCommand.id,
            label: HelloWorldCommand.label
        });
    }
}

import { MenuWidget } from './menu-widget';
import { AbstractViewContribution } from '@theia/core/lib/browser';

export const TestCommand: Command = { id: 'test:command' };

@injectable()
export class TestContribution extends AbstractViewContribution<MenuWidget> {

    constructor() {
        super({
            widgetId: MenuWidget.ID,
            widgetName: MenuWidget.LABEL,
            defaultWidgetOptions: { area: 'left' },
            toggleCommandId: TestCommand.id
        });
    }

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(TestCommand, {
            execute: () => super.openView({ activate: false, reveal: true })
        });
    }

    registerMenus(menus: MenuModelRegistry): void {
        super.registerMenus(menus);
    }
}


@injectable()
export class TreeContribution extends BaseTreeEditorContribution {
    @inject(ApplicationShell) protected shell: ApplicationShell;
    @inject(OpenerService) protected opener: OpenerService;

    constructor(
        @inject(TreeModelService) modelService: TreeEditor.ModelService,
        @inject(TreeLabelProvider) labelProvider: TreeLabelProvider
    ) {
        super(TreeEditorWidget.WIDGET_ID, modelService, labelProvider);
    }

    readonly id = TreeEditorWidget.WIDGET_ID;
    readonly label = MasterTreeWidget.WIDGET_LABEL;

    canHandle(uri: URI): number {
        if (uri.path.ext === '.tree') {
            return 1000;
        }
        return 0;
    }

    registerCommands(commands: CommandRegistry): void {
        // register your custom commands here

        super.registerCommands(commands);
    }

    registerMenus(menus: MenuModelRegistry): void {
        // register your custom menu actions here

        super.registerMenus(menus);
    }

    protected createWidgetOptions(uri: URI, options?: WidgetOpenerOptions): NavigatableWidgetOptions {

        return {
            kind: 'navigatable',
            uri: this.serializeUri(uri)
        };
    }

    protected serializeUri(uri: URI): string {
        return uri.withoutFragment().toString();
    }

}
