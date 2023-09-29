import { SingleTextInputDialog } from '@theia/core/lib/browser/dialogs';
import { ILogger } from '@theia/core/lib/common';
import { BinaryBuffer } from '@theia/core/lib/common/buffer';
import { Command } from '@theia/core/lib/common/command';
import URI from '@theia/core/lib/common/uri';
import { SingleUriCommandHandler } from '@theia/core/lib/common/uri-command-handler';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { FileSystemUtils } from '@theia/filesystem/lib/common';
import { inject, injectable } from '@theia/core/shared/inversify';
import { OpenerService } from '@theia/core/lib/browser';
import { WorkspaceService } from '@theia/workspace/lib/browser';

export const NewTreeExampleFileCommand: Command = {
    id: 'WebApp-tree.newExampleFile',
    label: 'New Deployment Example File'
};

export const NewTreeExampleFileCommand2: Command = {
    id: 'WebApp-tree.newExampleFile2',
    label: 'Insert your GitLab repository ID'
};

@injectable()
export class NewTreeExampleFileCommandHandler implements SingleUriCommandHandler {
    constructor(
        @inject(OpenerService)
        protected readonly openerService: OpenerService,
        @inject(FileService)
        protected readonly fileService: FileService,
        @inject(ILogger)
        protected readonly logger: ILogger,
        @inject(WorkspaceService)
        protected readonly workspaceService: WorkspaceService
    ) { }

    isEnabled() {
        return this.workspaceService.opened;
    }

    async execute(uri: URI) {
        const stat = await this.fileService.resolve(uri);
        if (!stat) {
            this.logger.error(`[NewTreeExampleFileCommandHandler] Could not create file stat for uri`, uri);
            return;
        }

        const dir = stat.isDirectory ? stat : await this.fileService.resolve(uri.parent);
        if (!dir) {
            this.logger.error(`[NewTreeExampleFileCommandHandler] Could not create file stat for uri`, uri.parent);
            return;
        }

        const targetUri = dir.resource.resolve('org-deployment.tree');
        const preliminaryFileUri = FileSystemUtils.generateUniqueResourceURI(dir, targetUri, false);
        const dialog = new SingleTextInputDialog({
            title: 'New Deployment File',
            initialValue: preliminaryFileUri.path.base
        });

        const fileName = await dialog.open();
        if (fileName) {
            const fileUri = dir.resource.resolve(fileName);
            const contentBuffer = BinaryBuffer.fromString(JSON.stringify(defaultData, null, 2));
            this.fileService.createFile(fileUri, contentBuffer)
                .then(_ => this.openerService.getOpener(fileUri))
                .then(openHandler => openHandler.open(fileUri));
        }
    }
}

// GITLAB
@injectable()
export class NewTreeExampleFileCommandHandler2 implements SingleUriCommandHandler {
    constructor(
        @inject(OpenerService)
        protected readonly openerService: OpenerService,
        @inject(FileService)
        protected readonly fileService: FileService,
        @inject(ILogger)
        protected readonly logger: ILogger,
        @inject(WorkspaceService)
        protected readonly workspaceService: WorkspaceService

    ) { }

    isEnabled() {
        return this.workspaceService.opened;
    }

    async execute(uri: URI) {

        const dialog = new SingleTextInputDialog({
            title: 'Insert your GitLab Repository ID',
            placeholder: 'GitLab Repository URL',
        });

        const repo_id = await dialog.open();
        if (repo_id) {

            const stat = await this.fileService.resolve(uri);
            if (!stat) {
                return;
            }
            const dir = stat.isDirectory ? stat : await this.fileService.resolve(uri.parent);
            if (!dir) {
                return;
            }

            const path1 = "/api/v4/projects/";
            const path2 = "/registry/repositories";

            var resultUrl = ""
            extractDomainAndRepo
            const result = extractDomainAndRepo(repo_id);

            if (result?.domain && result.repoPath) {
                resultUrl = `${result?.domain}${path1}${encodeURIComponent(result.repoPath)}${path2}`;
                console.log("Result URL:", resultUrl);
            } else {
                console.log("Invalid input URL");
                return;
            }

            //resultUrl = "https://gitlab.com/api/v4/projects/tfm73%2FAgnosticCloudServicesWithKubernetes/registry/repositories"
            fetch(resultUrl, {
                method: 'GET',
                headers: {
                    'Private-Token': ''
                },
            })
                .then(response => response.json())
                .then(responseData => {
                    console.log("Response Data:" + responseData)

                    var newData = deploymentDefaultData
                    responseData?.forEach((data: { name: string; path: string; location: string; }, index: any) => {

                        console.log("++++++++++" + JSON.stringify(data));

                        newData.children.push({
                            ...serviceDefaultData,
                            name: data?.path,
                            container: {
                                ...serviceDefaultData.container,
                                containerImagePath: data?.location
                            },
                            serviceConfig: {
                                ...serviceDefaultData.serviceConfig,
                                serviceName: data?.path
                            }
                        });

                    });

                    newData.children.shift();

                    const contentBuffer = BinaryBuffer.fromString(JSON.stringify(newData, null, 2));
                    const myFileUri = dir.resource.resolve("gitlab_repo" + ".tree");

                    this.fileService.createFile(myFileUri, contentBuffer)
                        .then(_ => this.openerService.getOpener(myFileUri))
                        .then(openHandler => openHandler.open(myFileUri));

                })
                .catch(error => {
                    //this.messageService.info("Error")
                    console.log("ERROR: " + error)
                })


        }

    }
}

function extractDomainAndRepo(inputUrl: string): { domain: string; repoPath: string } | null {

    const regex = /^(https?:\/\/[^/]+)\/([^/]+\/[^/]+)(?:\.git)?$/;
    const match = regex.exec(inputUrl);

    if (!match) {
        return null;
    }

    const domain = match[1];
    const repoPath = match[2];

    return { domain, repoPath };
}


export const defaultData = {
    "typeId": "Deployment",
    "name": "Deployment",
    "children": [
        {
            "typeId": "Service",
            "name": "Service",
            "container": {
                "containerImagePath": "Image path"
            },
            "serviceConfig": {
                "serviceType": "Load Balancer",
                "protocol": "TCP",
                "port": 8000,
                "serviceName": "Service name"
            },
            "cloudProvider": {
                "vendor": "Microsoft Azure",
                "cluster": "default",
                "namespace": "default"
            }
        }
    ]
}

const deploymentDefaultData = {
    "typeId": "Deployment",
    "name": "Deployment",
    "children": [
        {
            "typeId": "Service",
            "name": "Service",
            "container": {
                "containerImagePath": "Image path"
            },
            "serviceConfig": {
                "serviceType": "Load Balancer",
                "protocol": "TCP",
                "port": 8000,
                "serviceName": "Service name"
            },
            "cloudProvider": {
                "vendor": "Microsoft Azure",
                "cluster": "default",
                "namespace": "default"
            }
        }
    ]
}

const serviceDefaultData = {
    "typeId": "Service",
    "name": "Service",
    "container": {
        "containerImagePath": "Image path"
    },
    "serviceConfig": {
        "serviceType": "Load Balancer",
        "protocol": "TCP",
        "port": 8000,
        "serviceName": "Service name"
    },
    "cloudProvider": {
        "vendor": "Microsoft Azure",
        "cluster": "default",
        "namespace": "default"
    }
}
