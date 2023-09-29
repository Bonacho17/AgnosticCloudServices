package agnosticcloudinterface;

import io.fabric8.kubernetes.client.Config;

import io.fabric8.kubernetes.client.utils.Serialization;
import org.yaml.snakeyaml.Yaml;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

public class ProviderConfig implements ClusterConfig {

	public Config getConfig(String kubeconfigPath) {

		Config config = null;

		try (InputStream inputStream = new FileInputStream(kubeconfigPath)) {
			Yaml yaml = new Yaml();
			Object kubeconfigObject = yaml.load(inputStream);
			String kubeconfigYaml = Serialization.yamlMapper().writeValueAsString(kubeconfigObject);
			// System.out.println("[DEBUG]: " + kubeconfigYaml);
			config = Config.fromKubeconfig(kubeconfigYaml);

		} catch (IOException e) {
			e.printStackTrace();
		}

		return config;
	}

}
