package servicesconfiguration;

import kubernetesmanager.ServiceController;

public class ServiceManager {

	private final ServiceController serviceController;
	
	public ServiceManager(ServiceController serviceController) {
		this.serviceController = serviceController;
	}
	
	public String deployService(String serviceName, String containerImage, int port, String provider,
			String k8sNamespace) {
		return serviceController.deployService(serviceName, containerImage, port, provider, k8sNamespace);
	}

	public String removeService(String serviceName, String provider, String k8sNamespace) {
		return serviceController.removeService(serviceName, provider, k8sNamespace);
	}

	public String updateService(String serviceName, String provider, String k8sNamespace, String containerImage, int port) {
		return serviceController.updateService(serviceName, provider, k8sNamespace, containerImage, port);
	}

	public String migrateService(String serviceName, String containerImage, int port, String sourceProvider, String sourcek8sNamespace,
			String targetProvider, String targetk8sNamespace) {
		return serviceController.migrateService(serviceName, containerImage, port, sourceProvider, sourcek8sNamespace, targetProvider, targetk8sNamespace);
	}

	public String listServices(String provider, String k8sNamespace) {
		return serviceController.listServices(provider, k8sNamespace);
	}

	public String getServiceState(String serviceName, String provider, String k8sNamespace) {
		return serviceController.getServiceState(serviceName, provider, k8sNamespace);
	}

}
