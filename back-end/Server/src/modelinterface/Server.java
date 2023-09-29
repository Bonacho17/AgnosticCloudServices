package modelinterface;

import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import kubernetesmanager.ServiceController;
import kubernetesmanager.ServiceDeploymentBuilder;
import servicesconfiguration.ServiceManager;

public class Server {

	public static void main(String[] args) throws Exception {

		HttpServer server;
		try {
			server = HttpServer.create();
			server.bind(new java.net.InetSocketAddress(8000), 0);
			server.createContext("/deploy", new DeployHandler());
			server.createContext("/remove", new RemoveHandler());
			server.createContext("/update", new UpdateHandler());
			server.createContext("/migrate", new MigrateHandler());
			server.createContext("/list", new ListServicesHandler());
			server.createContext("/state", new ServiceStateHandler());
			server.start();
		} catch (IOException e) {
			e.printStackTrace();
		}
		System.out.println("Server started on port 8000.");
	}

	static class DeployHandler implements HttpHandler {

		ServiceDeploymentBuilder deploymentBuilder = new ServiceDeploymentBuilder();
		ServiceController controller = new ServiceController(deploymentBuilder);
		
		ServiceManager app = new ServiceManager(controller);

		public void handle(HttpExchange exchange) throws IOException {
			System.out.println("Deploy request received!");

			String response = "";

			String query = exchange.getRequestURI().getQuery();
			Map<String, String> queryParams = parseQueryParameters(query);

			String serviceName = queryParams.get("serviceName");
			String containerImage = queryParams.get("containerImage");
			String servicePort = queryParams.get("servicePort");
			String provider = queryParams.get("provider");
			String namespace = queryParams.get("namespace");

			System.out.println("Service name: " + serviceName);
			System.out.println("Container image: " + containerImage);
			System.out.println("Port: " + servicePort);
			System.out.println("Provider: " + provider);
			System.out.println("Kubernetes Namespace: " + namespace);

			ServiceDto sd = new ServiceDto();
			sd.setServiceName(serviceName);
			sd.setContainerImageName(containerImage);
			sd.setServicePortNumber(Integer.parseInt(servicePort));
			sd.setProviderId(provider);
			sd.setKubernetesNamespace(namespace);

			response = app.deployService(sd.getServiceName(), sd.getContainerImageName(), sd.getServicePortNumber(),
					sd.getProviderId(), sd.getKubernetesNamespace());

			Headers headers = exchange.getResponseHeaders();
			headers.set("Access-Control-Allow-Origin", "*");
			headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
			headers.set("Access-Control-Allow-Headers", "Content-Type");
			exchange.sendResponseHeaders(200, response.length());
			OutputStream os = exchange.getResponseBody();
			os.write(response.getBytes());
			os.close();
		}
	}

	static class RemoveHandler implements HttpHandler {

		ServiceDeploymentBuilder deploymentBuilder = new ServiceDeploymentBuilder();
		ServiceController controller = new ServiceController(deploymentBuilder);
		
		ServiceManager app = new ServiceManager(controller);

		public void handle(HttpExchange exchange) throws IOException {
			System.out.println("Remove request received!");

			String response = "";

			String query = exchange.getRequestURI().getQuery();
			Map<String, String> queryParams = parseQueryParameters(query);

			String serviceName = queryParams.get("serviceName");
			String provider = queryParams.get("provider");
			String namespace = queryParams.get("namespace");

			System.out.println("Service name: " + serviceName);
			System.out.println("Provider: " + provider);
			System.out.println("Kubernetes Namespace: " + namespace);

			ServiceDto sd = new ServiceDto();
			sd.setServiceName(serviceName);
			sd.setProviderId(provider);
			sd.setKubernetesNamespace(namespace);

			response = app.removeService(sd.getServiceName(), sd.getProviderId(), sd.getKubernetesNamespace());

			Headers headers = exchange.getResponseHeaders();
			headers.set("Access-Control-Allow-Origin", "*");
			headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
			headers.set("Access-Control-Allow-Headers", "Content-Type");
			exchange.sendResponseHeaders(200, response.length());
			OutputStream os = exchange.getResponseBody();
			os.write(response.getBytes());
			os.close();
		}
	}

	static class UpdateHandler implements HttpHandler {

		ServiceDeploymentBuilder deploymentBuilder = new ServiceDeploymentBuilder();
		ServiceController controller = new ServiceController(deploymentBuilder);
		
		ServiceManager app = new ServiceManager(controller);

		public void handle(HttpExchange exchange) throws IOException {
			System.out.println("Update request received!");

			String response = "";

			String query = exchange.getRequestURI().getQuery();
			Map<String, String> queryParams = parseQueryParameters(query);

			String serviceName = queryParams.get("serviceName");
			String containerImage = queryParams.get("containerImage");
			String servicePort = queryParams.get("servicePort");
			String provider = queryParams.get("provider");
			String namespace = queryParams.get("namespace");
			int numOfReplicas = 1;

			System.out.println("Service name: " + serviceName);
			System.out.println("Container image: " + containerImage);
			System.out.println("Port: " + servicePort);
			System.out.println("Provider: " + provider);
			System.out.println("Kubernetes Namespace: " + namespace);
			System.out.println("Number of replicas: " + numOfReplicas);

			ServiceDto sd = new ServiceDto();
			sd.setServiceName(serviceName);
			sd.setContainerImageName(containerImage);
			sd.setServicePortNumber(Integer.parseInt(servicePort));
			sd.setProviderId(provider);
			sd.setKubernetesNamespace(namespace);

			response = app.updateService(sd.getServiceName(),
					sd.getProviderId(), sd.getKubernetesNamespace(), sd.getContainerImageName(), sd.getServicePortNumber());

			Headers headers = exchange.getResponseHeaders();
			headers.set("Access-Control-Allow-Origin", "*");
			headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
			headers.set("Access-Control-Allow-Headers", "Content-Type");
			exchange.sendResponseHeaders(200, response.length());
			OutputStream os = exchange.getResponseBody();
			os.write(response.getBytes());
			os.close();
		}
	}

	static class MigrateHandler implements HttpHandler {

		ServiceDeploymentBuilder deploymentBuilder = new ServiceDeploymentBuilder();
		ServiceController controller = new ServiceController(deploymentBuilder);
		
		ServiceManager app = new ServiceManager(controller);

		public void handle(HttpExchange exchange) throws IOException {
			System.out.println("Migrate request received!");

			String response = "";

			String query = exchange.getRequestURI().getQuery();
			Map<String, String> queryParams = parseQueryParameters(query);

			String serviceName = queryParams.get("serviceName");
			String containerImage = queryParams.get("containerImage");
			String servicePort = queryParams.get("servicePort");
			String sourceProvider = queryParams.get("sourceProvider");
			String sourceNamespace = queryParams.get("sourceNamespace");
			String targetProvider = queryParams.get("targetProvider");
			String targetNamespace = queryParams.get("targetNamespace");

			System.out.println("Service name: " + serviceName);
			System.out.println("Container image: " + containerImage);
			System.out.println("Port: " + servicePort);
			System.out.println("Source provider: " + sourceProvider);
			System.out.println("Source K8s namespace: " + sourceNamespace);
			System.out.println("Target provider: " + targetProvider);
			System.out.println("Target K8s namespace: " + targetNamespace);

			response = app.migrateService(serviceName, containerImage, Integer.parseInt(servicePort), sourceProvider,
					sourceNamespace, targetProvider, targetNamespace);

			Headers headers = exchange.getResponseHeaders();
			headers.set("Access-Control-Allow-Origin", "*");
			headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
			headers.set("Access-Control-Allow-Headers", "Content-Type");
			exchange.sendResponseHeaders(200, response.length());
			OutputStream os = exchange.getResponseBody();
			os.write(response.getBytes());
			os.close();
		}
	}

	static class ListServicesHandler implements HttpHandler {

		ServiceDeploymentBuilder deploymentBuilder = new ServiceDeploymentBuilder();
		ServiceController controller = new ServiceController(deploymentBuilder);
		
		ServiceManager app = new ServiceManager(controller);

		public void handle(HttpExchange exchange) throws IOException {
			System.out.println("List Services request received!");

			String response = "";

			String query = exchange.getRequestURI().getQuery();
			Map<String, String> queryParams = parseQueryParameters(query);

			String provider = queryParams.get("provider");
			String namespace = queryParams.get("namespace");

			System.out.println("Provider: " + provider);
			System.out.println("Kubernetes Namespace: " + namespace);

			ServiceDto sd = new ServiceDto();
			sd.setProviderId(provider);
			sd.setKubernetesNamespace(namespace);

			response = app.listServices(sd.getProviderId(), sd.getKubernetesNamespace());

			Headers headers = exchange.getResponseHeaders();
			headers.set("Access-Control-Allow-Origin", "*");
			headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
			headers.set("Access-Control-Allow-Headers", "Content-Type");
			exchange.sendResponseHeaders(200, response.length());
			OutputStream os = exchange.getResponseBody();
			os.write(response.getBytes());
			os.close();
		}
	}

	static class ServiceStateHandler implements HttpHandler {

		ServiceDeploymentBuilder deploymentBuilder = new ServiceDeploymentBuilder();
		ServiceController controller = new ServiceController(deploymentBuilder);
		
		ServiceManager app = new ServiceManager(controller);

		public void handle(HttpExchange exchange) throws IOException {
			System.out.println("Service State request received!");

			String response = "";

			String query = exchange.getRequestURI().getQuery();
			Map<String, String> queryParams = parseQueryParameters(query);

			String serviceName = queryParams.get("serviceName");
			String provider = queryParams.get("provider");
			String namespace = queryParams.get("namespace");

			System.out.println("Service name: " + serviceName);
			System.out.println("Provider: " + provider);
			System.out.println("Kubernetes Namespace: " + namespace);

			ServiceDto sd = new ServiceDto();
			sd.setServiceName(serviceName);
			sd.setProviderId(provider);
			sd.setKubernetesNamespace(namespace);

			response = app.getServiceState(sd.getServiceName(), sd.getProviderId(), sd.getKubernetesNamespace());

			Headers headers = exchange.getResponseHeaders();
			headers.set("Access-Control-Allow-Origin", "*");
			headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
			headers.set("Access-Control-Allow-Headers", "Content-Type");
			exchange.sendResponseHeaders(200, response.length());
			OutputStream os = exchange.getResponseBody();
			os.write(response.getBytes());
			os.close();
		}
	}

	public static Map<String, String> parseQueryParameters(String query) {
		Map<String, String> queryParams = new HashMap<>();
		if (query != null) {
			String[] pairs = query.split("&");
			for (String pair : pairs) {
				String[] keyValue = pair.split("=");
				if (keyValue.length == 2) {
					String key = "", value = "";
					try {
						key = URLDecoder.decode(keyValue[0], "UTF-8");
						value = URLDecoder.decode(keyValue[1], "UTF-8");
					} catch (UnsupportedEncodingException e) {
						e.printStackTrace();
					}

					queryParams.put(key, value);
				}
			}
		}
		return queryParams;
	}

}
