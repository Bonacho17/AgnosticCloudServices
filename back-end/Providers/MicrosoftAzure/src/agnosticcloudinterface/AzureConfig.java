package agnosticcloudinterface;

import io.fabric8.kubernetes.client.Config;

public class AzureConfig implements ClusterConfig {
	
	/*private String masterUrl = "https://tfm-qgw9derg.hcp.northeurope.azmk8s.io:443";
	private String namespace = "default";
	private String oAuthToken = "";
	private boolean trustCerts = true;
	
	public Config getConfig() {
		
		Config config = new ConfigBuilder()
				.withMasterUrl(masterUrl)
				.withNamespace(namespace)
				.withOauthToken(oAuthToken)
				.withTrustCerts(trustCerts)
				.build();
		return config;
	}*/
	
	public Config getConfig() {
		String kubeconfigPath = "C:\\Users\\Bonacho\\azure_kubeconfig.yaml";
		ProviderConfig providerConfig = new ProviderConfig();
        return providerConfig.getConfig(kubeconfigPath);	
	}
    
}
