package agnosticcloudinterface;

import io.fabric8.kubernetes.client.Config;

public class LocalConfig implements ClusterConfig {

	public Config getConfig() {
		String kubeconfigPath = "C:\\Users\\Bonacho\\azure_kubeconfig.yaml";
		ProviderConfig providerConfig = new ProviderConfig();
		return providerConfig.getConfig(kubeconfigPath);
	}

}
