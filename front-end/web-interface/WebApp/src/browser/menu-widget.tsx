import React from 'react';
import { injectable, postConstruct, inject } from '@theia/core/shared/inversify';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { MessageService/*, URI*/ } from '@theia/core';
import { AlertMessage } from '@theia/core/lib/browser/widgets/alert-message';

import { Message, OpenerService } from '@theia/core/lib/browser';
import { FileService } from '@theia/filesystem/lib/browser/file-service';

@injectable()
export class MenuWidget extends ReactWidget {

    constructor(
        @inject(FileService)
        protected readonly fileService: FileService,
        @inject(OpenerService)
        protected readonly openerService: OpenerService,
    ) {
        super();
    }

    static readonly ID = 'Test:widget';
    static readonly LABEL = 'Deployment Manager';

    @inject(MessageService)
    protected readonly messageService!: MessageService;

    @postConstruct()
    protected async init(): Promise<void> {
        this.id = MenuWidget.ID;
        this.title.label = MenuWidget.LABEL;
        this.title.caption = MenuWidget.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'fa fa-cloud-upload';
        this.update();
    }

    render(): React.ReactElement {
        const header = `Please select the service to manage.`;
        const buttonStyle = {
            marginBottom: '17px',
            borderRadius: '5px',
            fontWeight: 'bold'
        };
        return (
            <div id='widget-container' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <AlertMessage type='INFO' header={header} />
                <button id='displayDeployButton' className='theia-button secondary' title='Deploy Service' onClick={_a => this.deployService()} style={buttonStyle}>Deploy</button>
                <button id='displayRemoveButton' className='theia-button secondary' title='Remove Service' onClick={_a => this.removeService()} style={buttonStyle}>Remove</button>
                <button id='displayUpdateButton' className='theia-button secondary' title='Update Service' onClick={_a => this.updateService()} style={buttonStyle}>Update</button>
                <button id='displayMigrateButton' className='theia-button secondary' title='Migrate Service' onClick={_a => this.migrateService()} style={buttonStyle}>Migrate</button>
            </div>
        );
    }

    private updateService() {

        const parsedData = {
            'serviceName': (document.getElementById('#/properties/serviceConfig/properties/serviceName-input') as HTMLInputElement).value,
            'containerImage': (document.getElementById('#/properties/container/properties/containerImagePath-input') as HTMLInputElement).value,
            'servicePort': (document.getElementById('#/properties/serviceConfig/properties/port-input') as HTMLInputElement).value,
            'provider': (document.getElementById('#/properties/cloudProvider/properties/vendor-input') as HTMLInputElement).value,
            'namespace': (document.getElementById('#/properties/cloudProvider/properties/namespace-input') as HTMLInputElement).value
        };

        console.log("[MY DEBUG] Service name: " + parsedData.serviceName);
        console.log("[MY DEBUG] Container image: " + parsedData.containerImage);
        console.log("[MY DEBUG] Port: " + parsedData.servicePort);
        console.log("[MY DEBUG] Provider: " + parsedData.provider);
        console.log("[MY DEBUG] K8s namespace: " + parsedData.namespace);

        console.log("Sending request...");

        // temp
        if (parsedData.provider == 'Microsoft Azure') {
            parsedData.provider = 'azure'
        }

        const url = `http://localhost:8000/update?serviceName=${parsedData.serviceName}&containerImage=${parsedData.containerImage}&servicePort=${parsedData.servicePort}&provider=${parsedData.provider}&namespace=${parsedData.namespace}`;

        fetch(url, {
            method: 'GET'
        })
            .then(response => response.text())
            .then(responseData => {
                console.log("-----> " + responseData)
                this.messageService.info(responseData)
            })
            .catch(error => {
                this.messageService.info("Error")
                console.log("ERROR: " + error)
            })
    }

    private migrateService() {

        const parsedData = {
            'serviceName': (document.getElementById('#/properties/serviceConfig/properties/serviceName-input') as HTMLInputElement).value,
            'containerImage': (document.getElementById('#/properties/container/properties/containerImagePath-input') as HTMLInputElement).value,
            'servicePort': (document.getElementById('#/properties/serviceConfig/properties/port-input') as HTMLInputElement).value,
            'sourceProvider': (document.getElementById('#/properties/cloudProvider/properties/vendor-input') as HTMLInputElement).value,
            'sourceNamespace': (document.getElementById('#/properties/cloudProvider/properties/namespace-input') as HTMLInputElement).value,
            'targetProvider': (document.getElementById('#/properties/cloudProvider/properties/vendor_to-input') as HTMLInputElement).value,
            'targetNamespace': (document.getElementById('#/properties/cloudProvider/properties/namespace_to-input') as HTMLInputElement).value
        };

        console.log("[MY DEBUG] Service name: " + parsedData.serviceName);
        console.log("[MY DEBUG] Container image: " + parsedData.containerImage);
        console.log("[MY DEBUG] Port: " + parsedData.servicePort);
        console.log("[MY DEBUG] Source provider: " + parsedData.sourceProvider);
        console.log("[MY DEBUG] Source K8s namespace: " + parsedData.sourceNamespace);
        console.log("[MY DEBUG] Target provider: " + parsedData.targetProvider);
        console.log("[MY DEBUG] Target K8s namespace: " + parsedData.targetNamespace);

        console.log("Sending request...");

        if (parsedData.sourceProvider == 'Microsoft Azure') {
            parsedData.sourceProvider = 'azure'
        }
        if (parsedData.targetProvider == 'Microsoft Azure') {
            parsedData.targetProvider = 'azure'
        }

        const url = `http://localhost:8000/migrate?serviceName=${parsedData.serviceName}&containerImage=${parsedData.containerImage}&servicePort=${parsedData.servicePort}&sourceProvider=${parsedData.sourceProvider}&sourceNamespace=${parsedData.sourceNamespace}&targetProvider=${parsedData.targetProvider}&targetNamespace=${parsedData.targetNamespace}`;

        fetch(url, {
            method: 'GET'
        })
            .then(response => response.text())
            .then(responseData => {
                console.log("-----> " + responseData)
                this.messageService.info(responseData)
            })
            .catch(error => {
                this.messageService.info("Error")
                console.log("ERROR: " + error)
            })
    }

    private deployService() {

        const parsedData = {
            'serviceName': (document.getElementById('#/properties/serviceConfig/properties/serviceName-input') as HTMLInputElement).value,
            'containerImage': (document.getElementById('#/properties/container/properties/containerImagePath-input') as HTMLInputElement).value,
            'servicePort': (document.getElementById('#/properties/serviceConfig/properties/port-input') as HTMLInputElement).value,
            'provider': (document.getElementById('#/properties/cloudProvider/properties/vendor-input') as HTMLInputElement).value,
            'namespace': (document.getElementById('#/properties/cloudProvider/properties/namespace-input') as HTMLInputElement).value
        };

        console.log("[MY DEBUG] Service name: " + parsedData.serviceName);
        console.log("[MY DEBUG] Container image: " + parsedData.containerImage);
        console.log("[MY DEBUG] Port: " + parsedData.servicePort);
        console.log("[MY DEBUG] Provider: " + parsedData.provider);
        console.log("[MY DEBUG] K8s namespace: " + parsedData.namespace);

        console.log("Sending request...");

        if (parsedData.provider == 'Microsoft Azure') {
            parsedData.provider = 'azure'
        }

        const url = `http://localhost:8000/deploy?serviceName=${parsedData.serviceName}&containerImage=${parsedData.containerImage}&servicePort=${parsedData.servicePort}&provider=${parsedData.provider}&namespace=${parsedData.namespace}`;

        fetch(url, {
            method: 'GET'
        })
            .then(response => response.text())
            .then(responseData => {
                console.log("-----> " + responseData)
                this.messageService.info(responseData)
            })
            .catch(error => {
                this.messageService.info("Error")
                console.log("ERROR: " + error)
            })
    }

    private removeService() {

        console.log("Sending request...");

        const parsedData = {
            'serviceName': (document.getElementById('#/properties/serviceConfig/properties/serviceName-input') as HTMLInputElement).value,
            'provider': (document.getElementById('#/properties/cloudProvider/properties/vendor-input') as HTMLInputElement).value,
            'namespace': (document.getElementById('#/properties/cloudProvider/properties/namespace-input') as HTMLInputElement).value
        };

        console.log("[MY DEBUG] Service name: " + parsedData.serviceName);
        console.log("[MY DEBUG] Provider: " + parsedData.provider);
        console.log("[MY DEBUG] K8s namespace: " + parsedData.namespace);

        console.log("Sending request...");

        if (parsedData.provider == 'Microsoft Azure') {
            parsedData.provider = 'azure'
        }

        const url = `http://localhost:8000/remove?serviceName=${parsedData.serviceName}&provider=${parsedData.provider}&namespace=${parsedData.namespace}`;

        fetch(url, {
            method: 'GET'
        })
            .then(response => response.text())
            .then(responseData => {
                console.log("--------------------------> " + responseData)
                this.messageService.info(responseData)
            })
            .catch(error => {
                this.messageService.info("Error")
                console.log("ERROR: " + error)
            })
    }

    protected onActivateRequest(msg: Message): void {
        super.onActivateRequest(msg);
        const htmlElement = document.getElementById('displayMessageButton');
        if (htmlElement) {
            htmlElement.focus();
        }
    }

}
