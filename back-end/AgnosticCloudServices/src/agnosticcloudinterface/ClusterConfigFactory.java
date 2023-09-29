package agnosticcloudinterface;

public class ClusterConfigFactory {

	public static ClusterConfig createConfig(String provider) {

		switch (provider) {
			case "azure":
				return new AzureConfig();
			case "gcp":
				return new GcpConfig();
			case "aws":
				return new AwsConfig();
			default:
				return new LocalConfig();
		}

	}

}
