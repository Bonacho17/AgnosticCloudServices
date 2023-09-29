package kubernetesmanager;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import agnosticcloudinterface.ClusterConfigFactory;
import io.fabric8.kubernetes.api.model.LocalObjectReference;
import io.fabric8.kubernetes.api.model.Secret;
import io.fabric8.kubernetes.api.model.SecretBuilder;
import io.fabric8.kubernetes.api.model.Service;
import io.fabric8.kubernetes.api.model.ServiceBuilder;
import io.fabric8.kubernetes.api.model.ServicePort;
import io.fabric8.kubernetes.api.model.ServiceSpecBuilder;
import io.fabric8.kubernetes.api.model.apps.Deployment;
import io.fabric8.kubernetes.api.model.apps.DeploymentBuilder;
import io.fabric8.kubernetes.client.Config;
import io.fabric8.kubernetes.client.DefaultKubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClient;

public class ServiceDeploymentBuilder {

	public String buildService(String serviceName, String containerImage, int port, String provider,
			String k8sNamespace) {
		Config config = ClusterConfigFactory.createConfig(provider).getConfig();
		KubernetesClient client = new DefaultKubernetesClient(config);
		
		Path filePath = Paths.get("C:\\Users\\Bonacho\\gitlab-repo-auth.json");
		String configJson = "";
		try {
			String jsonContent = new String(Files.readAllBytes(filePath));
			configJson = Base64.getEncoder().encodeToString(jsonContent.getBytes(StandardCharsets.UTF_8));
		} catch (IOException e) {
			e.printStackTrace();
		}
		Secret gitlabRegistrySecret = new SecretBuilder()
		  .withNewMetadata()
		    .withName("gitlab-registry-secret")
		  .endMetadata()
		  .withType("kubernetes.io/dockerconfigjson")
		  .addToData(".dockerconfigjson", configJson)
		  .build();
		client.secrets().createOrReplace(gitlabRegistrySecret);
		
		String deployment_name = serviceName.concat("-deployment");
		
		Map<String, String> labels = Collections.singletonMap("app", serviceName);
		Deployment deployment = new DeploymentBuilder()
				.withNewMetadata()
					.withName(deployment_name)
						.withLabels(labels).addToLabels(labels)
				.endMetadata()
				.withNewSpec()
					.withNewSelector()
						.addToMatchLabels(labels)
					.endSelector()
					.withReplicas(1)
					.withNewTemplate()
						.withNewMetadata()
							.withLabels(labels).addToLabels(labels)
						.endMetadata()
						.withNewSpec()
							.addNewContainer()
								.withName(deployment_name)
								.withImage(containerImage)
								.addNewPort()
									.withName("http")
									.withContainerPort(port)
								.endPort()
							.endContainer()
							.withImagePullSecrets(new LocalObjectReference("gitlab-registry-secret"))
						.endSpec()
					.endTemplate()
				.endSpec()
			.build();

		deployment = client.apps().deployments().create(deployment);

		ServiceSpecBuilder spec = new ServiceSpecBuilder();
		ServicePort servicePort = new ServicePort();
		servicePort.setPort(port);
		servicePort.setName("http");
		Set<ServicePort> servicePorts = new HashSet<>();
		servicePorts.add(servicePort);
		spec.addAllToPorts(servicePorts);
		spec.withType("LoadBalancer");
		spec.withSelector(labels);

		Service service = new ServiceBuilder()
				.withNewMetadata()
					.withName(serviceName)
						.withLabels(labels)
				.endMetadata()
				.withSpec(spec.build())
			.build();
		service = client.services().inNamespace(k8sNamespace).createOrReplace(service);
		
		String endpoint = getServiceEndpoint(client, serviceName, k8sNamespace);
		
		client.close();
		
		return "Service successfully deployed! Available at: " + endpoint;
	}
	
	private String getServiceEndpoint(KubernetesClient client, String serviceName, String namespace) {
		
        boolean isSuccess = waitForLoadBalancerIngress(client, serviceName, 180);
		String endpoint = "";
        if (isSuccess) {
            Service service = client.services().inNamespace(namespace).withName(serviceName).get();

            String loadBalancerIP = service.getStatus().getLoadBalancer().getIngress().get(0).getIp();
            ServicePort servicePort = service.getSpec().getPorts().get(0);
            int port = servicePort.getPort();

            endpoint = loadBalancerIP + ":" + port;
        } else {
        	System.err.println("Timeout: LoadBalancer IP/hostname not available within the specified time.");
        }
        
        return endpoint;
	}
	
	private boolean waitForLoadBalancerIngress(KubernetesClient client, String serviceName, int timeoutSeconds) {
        long startTime = System.currentTimeMillis();
        while (true) {
            Service service = client.services().inNamespace("default").withName(serviceName).get();
            if (service != null && service.getStatus() != null &&
                    service.getStatus().getLoadBalancer() != null &&
                    !service.getStatus().getLoadBalancer().getIngress().isEmpty()) {
                return true;
            }

            long currentTime = System.currentTimeMillis();
            if (currentTime - startTime >= (timeoutSeconds * 1000)) {
                return false;
            }

            try {
				Thread.sleep(5000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
        }
    }
	
}
