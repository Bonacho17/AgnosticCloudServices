package modelinterface;

import kubernetesmanager.ServiceController;
import kubernetesmanager.ServiceDeploymentBuilder;
import servicesconfiguration.ServiceManager;

public class CliServer {

	public static void main(String[] args) throws Exception {

		String operation = args[0];

		ServiceDeploymentBuilder deploymentBuilder = new ServiceDeploymentBuilder();
		ServiceController controller = new ServiceController(deploymentBuilder);
		
		ServiceManager app = new ServiceManager(controller);

		String result = "";
		if (operation.equals("deploy")) {

			String serviceName = args[1];
			String containerImage = args[2];
			String servicePort = args[3];
			String provider = args[4];
			String namespace = args[5];

			System.out.println();
			System.out.println("Service name: " + serviceName);
			System.out.println("Container image: " + containerImage);
			System.out.println("Port: " + servicePort);
			System.out.println("Provider: " + provider);
			System.out.println("K8s namespace: " + namespace);

			ServiceDto sd = new ServiceDto();
			sd.setServiceName(serviceName);
			sd.setContainerImageName(containerImage);
			sd.setServicePortNumber(Integer.parseInt(servicePort));
			sd.setProviderId(provider);
			sd.setKubernetesNamespace(namespace);

			result = app.deployService(sd.getServiceName(), sd.getContainerImageName(), sd.getServicePortNumber(),
					sd.getProviderId(), sd.getKubernetesNamespace());

		} else if (operation.equals("remove")) {

			String serviceName = args[1];
			String provider = args[2];
			String namespace = args[3];

			System.out.println("Service name: " + serviceName);
			System.out.println("Provider: " + provider);
			System.out.println("Kubernetes Namespace: " + namespace);

			result = app.removeService(serviceName, provider, namespace);

		} else if (operation.equals("update")) {

			String serviceName = args[1];
			String containerImage = args[2];
			String servicePort = args[3];
			String provider = args[4];
			String namespace = args[5];

			System.out.println("Service name: " + serviceName);
			System.out.println("Container image: " + containerImage);
			System.out.println("Port: " + servicePort);
			System.out.println("Provider: " + provider);
			System.out.println("Kubernetes namespace: " + namespace);

			ServiceDto sd = new ServiceDto();
			sd.setServiceName(serviceName);
			sd.setContainerImageName(containerImage);
			sd.setServicePortNumber(Integer.parseInt(servicePort));
			sd.setProviderId(provider);
			sd.setKubernetesNamespace(namespace);

			result = app.updateService(sd.getServiceName(), sd.getContainerImageName(),
					sd.getProviderId(), sd.getKubernetesNamespace(), sd.getServicePortNumber());

		} else if (operation.equals("migrate")) {

			String serviceName = args[1];
			String containerImage = args[2];
			String servicePort = args[3];
			String sourceProvider = args[2];
			String sourceNamespace = args[3];
			String targetProvider = args[4];
			String targetNamespace = args[5];

			System.out.println("Service name: " + serviceName);
			System.out.println("Container image: " + containerImage);
			System.out.println("Port: " + servicePort);
			System.out.println("Source provider: " + sourceProvider);
			System.out.println("Source K8s namespace: " + sourceNamespace);
			System.out.println("Target provider: " + targetProvider);
			System.out.println("Target K8s namespace: " + targetNamespace);

			result = app.migrateService(serviceName, containerImage, Integer.parseInt(servicePort), sourceProvider,
					sourceNamespace, targetProvider, targetNamespace);

		} else if (operation.equals("list")) {

			String provider = args[1];
			String namespace = args[2];

			System.out.println("Provider: " + provider);
			System.out.println("Kubernetes Namespace: " + namespace);

			ServiceDto sd = new ServiceDto();
			sd.setProviderId(provider);
			sd.setKubernetesNamespace(namespace);

			result = app.listServices(sd.getProviderId(), sd.getKubernetesNamespace());

		} else if (operation.equals("state")) {

			String serviceName = args[1];
			String provider = args[2];
			String namespace = args[3];

			System.out.println("Service name: " + serviceName);
			System.out.println("Provider: " + provider);
			System.out.println("Kubernetes Namespace: " + namespace);

			result = app.getServiceState(serviceName, provider, namespace);
		}

		System.out.println(result);

		System.exit(0);

	}

}
