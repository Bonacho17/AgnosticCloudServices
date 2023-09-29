import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, SelectionService, MAIN_MENU_BAR } from '@theia/core/lib/common';
import { inject, injectable } from '@theia/core/shared/inversify';
import { WorkspaceRootUriAwareCommandHandler } from '@theia/workspace/lib/browser/workspace-commands';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { NewTreeExampleFileCommandHandler, NewTreeExampleFileCommand, NewTreeExampleFileCommandHandler2, NewTreeExampleFileCommand2 } from './config-file-command';

const TREE_EDITOR_MAIN_MENU = [...MAIN_MENU_BAR, '9_treeeditormenu'];

@injectable()
export class NewTreeExampleFileCommandContribution implements CommandContribution {

    constructor(
        @inject(SelectionService)
        private readonly selectionService: SelectionService,
        @inject(WorkspaceService)
        private readonly workspaceService: WorkspaceService,
        @inject(NewTreeExampleFileCommandHandler)
        private readonly newExampleFileHandler: NewTreeExampleFileCommandHandler,
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(NewTreeExampleFileCommand,
            new WorkspaceRootUriAwareCommandHandler(
                this.workspaceService,
                this.selectionService,
                this.newExampleFileHandler
            )
        );
    }
}

@injectable()
export class NewTreeExampleFileCommandContribution2 implements CommandContribution {

    constructor(
        @inject(SelectionService)
        private readonly selectionService: SelectionService,
        @inject(WorkspaceService)
        private readonly workspaceService: WorkspaceService,
        @inject(NewTreeExampleFileCommandHandler2)
        private readonly newExampleFileHandler2: NewTreeExampleFileCommandHandler2,
    ) { }

    registerCommands(registry: CommandRegistry): void {

        registry.registerCommand(NewTreeExampleFileCommand2,
            new WorkspaceRootUriAwareCommandHandler(
                this.workspaceService,
                this.selectionService,
                this.newExampleFileHandler2
            )
        );
    }
}

@injectable()
export class NewTreeExampleFileMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerSubmenu(TREE_EDITOR_MAIN_MENU, 'Deployment');

        menus.registerMenuAction(TREE_EDITOR_MAIN_MENU, {
            commandId: NewTreeExampleFileCommand.id,
            label: 'New Deployment'
        });
    }

}

@injectable()
export class NewTreeExampleFileMenuContribution2 implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerSubmenu(TREE_EDITOR_MAIN_MENU, 'Deployment');

        menus.registerMenuAction(TREE_EDITOR_MAIN_MENU, {
            commandId: NewTreeExampleFileCommand2.id,
            label: 'New Deployment from GitLab Repository'
        });
    }

}
