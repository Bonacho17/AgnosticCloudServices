package agnosticcloudinterface;

import io.fabric8.kubernetes.client.Config;
import io.fabric8.kubernetes.client.ConfigBuilder;

public class AwsConfig implements ClusterConfig {
	
	private String masterUrl = "https://C7873B0A65CC3360A4FED85AAC45DBC9.yl4.eu-north-1.eks.amazonaws.com";
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
