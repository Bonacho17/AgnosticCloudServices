package kubernetesmanager;

import java.util.List;

import agnosticcloudinterface.ClusterConfigFactory;
import io.fabric8.kubernetes.api.model.EndpointAddress;
import io.fabric8.kubernetes.api.model.EndpointSubset;
import io.fabric8.kubernetes.api.model.Endpoints;
import io.fabric8.kubernetes.api.model.ServiceList;
import io.fabric8.kubernetes.client.Config;
import io.fabric8.kubernetes.client.DefaultKubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClient;

public class ServiceController {

	private final ServiceDeploymentBuilder deploymentBuilder;
	
	public ServiceController(ServiceDeploymentBuilder deploymentBuilder) {
		this.deploymentBuilder = deploymentBuilder;
	}
	
	public String deployService(String serviceName, String containerImage, int port, String provider,
			String k8sNamespace) {
		return deploymentBuilder.buildService(serviceName, containerImage, port, provider, k8sNamespace);
	}

	public String removeService(String serviceName, String provider, String k8sNamespace) {
		Config config = ClusterConfigFactory.createConfig(provider).getConfig();
		boolean removedDeployment = removeDeployment(serviceName.concat("-deployment"), provider, k8sNamespace, config);
		String statusMsg = "";
		if (!removedDeployment) {
			statusMsg = "Error trying to remove deployment...";
			return statusMsg;
		}
		try (KubernetesClient client = new DefaultKubernetesClient(config)) {	
			boolean deleted = client.services()
					.inNamespace(k8sNamespace)
					.withName(serviceName)
					.delete();
			if (deleted) {
				statusMsg = "Service deleted successfully.";
			} else {
				statusMsg = "Service deletion failed.";
			}
		}
		return statusMsg;
	}
	
	private boolean removeDeployment(String deployment, String provider, String k8sNamespace, Config config) {
		boolean deleted;
		try (KubernetesClient client = new DefaultKubernetesClient(config)) {
			String namespace = k8sNamespace;
			String deploymentName = deployment;
			deleted = client.apps().deployments()
					.inNamespace(namespace)
					.withName(deploymentName)
					.delete();
		}
		return deleted;
	}

	public String updateService(String serviceName, String provider, String k8sNamespace, String containerImage, int port) {
		String statusMsg = "Service successfull updated!";
		String removeStatus = removeService(serviceName, provider, k8sNamespace);
		if (removeStatus == "Error trying to remove deployment...") {
			statusMsg = "Could not remove service.";
		}
		String deployStatus = deployService(serviceName, containerImage, port, provider, k8sNamespace);
		if (deployStatus == "Service was not deployed!") {
			statusMsg = "Could not deploy service.";
		}			
		return statusMsg;
	}

	public String migrateService(String serviceName, String containerImage, int port, String sourceProvider, String sourcek8sNamespace,
		String targetProvider, String targetk8sNamespace) {
		String statusMsg = "Service successfull migrated!";
		String removeStatus = removeService(serviceName, sourceProvider, sourcek8sNamespace);
		if (removeStatus == "Error trying to remove deployment...") {
			statusMsg = "Could not remove service.";
		}
		String deployStatus = deployService(serviceName, containerImage, port, targetProvider, targetk8sNamespace);
		if (deployStatus == "Service was not deployed!") {
			statusMsg = "Could not deploy service.";
		}			
		return statusMsg;
	}

	public String listServices(String provider, String k8sNamespace) {
		Config config = ClusterConfigFactory.createConfig(provider).getConfig();
		KubernetesClient client = new DefaultKubernetesClient(config);
		ServiceList serviceList = client.services().inNamespace(k8sNamespace).list();
		StringBuilder result = new StringBuilder();
		serviceList.getItems().forEach(service -> result.append(service.getMetadata().getName()).append("\n"));
		client.close();
		return result.toString();
	}

	public String getServiceState(String serviceName, String provider, String k8sNamespace) {
		Config config = ClusterConfigFactory.createConfig(provider).getConfig();
		KubernetesClient client = new DefaultKubernetesClient(config);
		String msg = "Service is not running.";
        Endpoints endpoints = client.endpoints().inNamespace(k8sNamespace).withName(serviceName).get();
        if (endpoints != null && endpoints.getSubsets() != null) {
            for (EndpointSubset subset : endpoints.getSubsets()) {
                if (subset.getPorts() != null && !subset.getPorts().isEmpty()
                        && subset.getAddresses() != null && !subset.getAddresses().isEmpty()) {
                    List<EndpointAddress> addresses = subset.getAddresses();
                    for (EndpointAddress address : addresses) {
                        String ip = address.getIp();
                        msg = "Service is running at: " + ip;
                    }
                }
            }
        }
		return msg;
	}

}
