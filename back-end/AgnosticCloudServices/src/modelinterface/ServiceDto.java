package modelinterface;

public class ServiceDto {

	private String serviceName;
	private String containerImageName;
	private int servicePortNumber;
	private String providerId;
	private String kubernetesNamespace;

	public String getServiceName() {
		return serviceName;

	}

	public void setServiceName(String serviceName) {
		this.serviceName = serviceName;

	}

	public String getContainerImageName() {
		return containerImageName;

	}

	public void setContainerImageName(String containerImageName) {
		this.containerImageName = containerImageName;

	}

	public int getServicePortNumber() {
		return servicePortNumber;

	}

	public void setServicePortNumber(int servicePortNumber) {
		this.servicePortNumber = servicePortNumber;

	}

	public String getProviderId() {
		return providerId;

	}

	public void setProviderId(String providerId) {
		this.providerId = providerId;

	}

	public String getKubernetesNamespace() {
		return kubernetesNamespace;

	}

	public void setKubernetesNamespace(String kubernetesNamespace) {
		this.kubernetesNamespace = kubernetesNamespace;

	}

}
