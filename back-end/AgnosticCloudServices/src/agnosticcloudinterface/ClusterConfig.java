package agnosticcloudinterface;

import io.fabric8.kubernetes.client.Config;

public interface ClusterConfig {

	Config getConfig();

	// boolean supports(String providerName);

}
