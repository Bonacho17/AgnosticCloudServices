package agnosticcloudinterface;

import io.fabric8.kubernetes.client.Config;
import io.fabric8.kubernetes.client.ConfigBuilder;

public class GcpConfig implements ClusterConfig {

	private String masterUrl = "https://34.136.211.183";
	private String namespace = "default";
	private String oAuthToken = "";
	private boolean trustCerts = true;
	
	public Config getConfig() {
		Config config = new ConfigBuilder()
				.withMasterUrl(masterUrl)
				.withNamespace(namespace)
				.withOauthToken(oAuthToken)
				.withTrustCerts(trustCerts).build();
		return config;
	}

}
