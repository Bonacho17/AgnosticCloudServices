package agnosticcloudinterface;

public enum CloudProvider {

	AZURE("Microsoft Azure", 1),
	GCP("Google Cloud Platform", 2),
	AWS("Amazon Web Services", 3);

	private final String fullName;
	private final int number;

	private CloudProvider(String fullName, int number) {
		this.fullName = fullName;
		this.number = number;
	}

	public String getFullName() {
		return fullName;
	}

	public int getNumber() {
		return number;
	}

}
