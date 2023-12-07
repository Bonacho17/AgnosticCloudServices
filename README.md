# Agnostic Cloud Services

API endpoints:

## Deploy Service

Deploys a service on a cloud platform.

`POST /api/services/deploy`

### Parameters

| Name                                        | Type    | In    | Description                                                                                                                   |
|:-------------------------------------------:|:-------:|:-----:| :----------------------------------------------------------------------------------------------------------------------------:|
| `service.name`                              | string  | body  | The name to be assigned to the service.                                                                                       |
| `service.service_type`                      | string  | body  | A type that defines how the service is exposed and how it behaves (_ClusterIP_, _LoadBalancer_, or _NodePort_).               |
| `service.port_mappings[idx].port`           | int     | body  | The port on which the service will accept traffic.                                                                            |
| `service.port_mappings[idx].target_port`    | int     | body  | The port that the containers accept traffic on and where the service should route traffic to.                                 |
| `service.port_mappings[idx].protocol`       | string  | body  | The network protocol used for the port mapping (_TCP_ - default, _UDP_).                                                      |
| `container.name`                            | string  | body  | The container's name (optional).                                                                                              |
| `container.container_image`                 | string  | body  | Container image location or endpoint.                                                                                         |
| `container.initialCommand`                  | string  | body  | Command to execute upon container boot-up (optional).                                                                         |
| `container.envvar`                          | string  | body  | Variables can set for containers to see information about their environment or inject data (includes a _name_ and a _value_). |
| `provider_config.vendor`                    | string  | body  | The IT infrastructures (including public cloud vendors or on-premises platforms) where the service will be deployed.          |
| `provider_config.cluster.name`              | string  | body  | A deployment will use compute instances managed in a logical grouping called a _cluster_.                                     |
| `provider_config.cluster.namespace.name`    | string  | body  | Groups inside clusters intended for use in environments with many users spread across multiple teams, or projects.            |

Supported Media Types: `application/json`

**Request example**:

`curl -X POST http://localhost:8000/api/services/deploy`

    Body:

    {
        "service": {
            "name": "hello-world-service-1",
            "serviceType": "LoadBalancer",
            "portMappings": [
                {
                    "port": 8081,
                    "targetPort": 8081,
                    "protocol": "TCP"
                }
            ]
        },
        "container": {
            "name": "hello-world-1-container",
            "containerImage": "bonacho17/web-service-1:latest"
            "envVars": [],
            "initialCommand": "",
        },
        "providerConfig": {
            "vendor": "Local",
            "cluster": {
                "name": "minikube",
                "namespace": {
                    "name": "default"
                }
            }
        }
    }

**Response example**:
    
    Status: 201 Created

    Body: "Service successfully deployed! Available at: localhost:8081."

### Possible Status Code responses

    201, 400, 401, 404, 409


## Remove Service

Removes a service from a Kubernetes cluster/namespace.

`DELETE /api/services/{service_name}?provider={provider}&cluster={cluster}&namespace={namespace}`

### Parameters

| Name              | Type      | In    | Description                                       |
|:-----------------:|:---------:|:-----:| :------------------------------------------------:|
| `service_name`    | string    | path  | The name of the service to be removed.            |
| `provider`        | string    | query | The provider where the service is deployed.       |
| `cluster`         | string    | query | The cluster where the service is deployed.        |
| `namespace`       | string    | query | The namespace where the service is deployed.      |

Supported Media Types: `text/plain`

**Request example**:

`curl -X DELETE http://localhost:8000/api/services/hello-world-service-1?provider=local&cluster=minikube&namespace=default`

**Response example**:
    
    Status: 200 OK

    Body: "Service hello-world-service-1 removed successfully!"

### Possible Status Code responses

    200, 404, 410


## Update Service

Updates the container image of a service.

`PUT /api/services/{service_name}??provider={provider}&cluster={cluster}&namespace={namespace}`

### Parameters

| Name              | Type      | In    | Description                                       |
|:-----------------:|:---------:|:-----:| :------------------------------------------------:|
| `service_name`    | string    | path  | The name of the service to be updated.            |
| `provider`        | string    | query | The provider where the service is deployed.       |
| `cluster`         | string    | query | The cluster where the service is deployed.        |
| `namespace`       | string    | query | The namespace where the service is deployed.      |
| `containerImage`  | string    | body  | The container image endpoint for the container.   |
| `envVars`         | string    | body  | Container's list of environment variables.        |
| `initialCommand`  | string    | body  | The initial command for the container.            |

Supported Media Types: `text/plain`

**Request example**:

`curl -X PUT http://localhost:8000/api/services/hello-world-service-1?provider=local&cluster=minikube&namespace=default`

    Body:

    {
        "containerImage": "bonacho17/web-service-1:0.0.1"
        "envVars": [],
        "initialCommand": "",
    }

**Response example**:
    
    Status: 200 OK

    Body: "Service hello-world-service-1 updated successfully!"

### Possible Status Code responses

    200, 400, 404, 409


## Service Migration

Migrates a service from one provider to another.

`PUT /api/services/{service_name}?provider={src_provider}&cluster={src_cluster}&namespace={src_namespace}`

### Parameters

| Name              | Type      | In    | Description                                           |
|:-----------------:|:---------:|:-----:| :----------------------------------------------------:|
| `service_name`    | string    | path  | The name of the service to be migrated.               |
| `src_provider`    | string    | query | The provider where the service is deployed.           |
| `src_cluster`     | string    | query | The cluster where the service is deployed.            |
| `src_namespace`   | string    | query | The namespace where the service is deployed.          |
| `tgt_provider`    | string    | body  | The provider to which the service will be migrated.   |
| `tgt_cluster`     | string    | body  | The cluster to which the service will be migrated.    |
| `tgt_namespace`   | string    | body  | The namespace to which the service will be migrated.  |

Supported Media Types: `text/plain`

**Request example**:

`curl -X PUT http://localhost:8000/api/services/hello-world-service-1?provider=local&cluster=minikube&namespace=default`

    Body:

    {
        "tgt_provider": "Azure",
        "tgt_cluster": "default",
        "tgt_namespace": "default"
    }

**Response example**:
    
    Status: 200 OK

    Body: "Service hello-world-service-1 successfully migrated!"

### Possible Status Code responses

    200, 400, 404, 409


## Get Service State

Retrieves the state of a specific service.

`GET /api/services/{service_name}?provider={provider}&cluster={cluster}&namespace={namespace}`

### Parameters

| Name              | Type      | In    | Description                                       |
|:-----------------:|:---------:|:-----:| :------------------------------------------------:|
| `service_name`    | string    | path  | The name of the deployed service.                 |
| `provider`        | string    | query | The provider where the service is deployed.       |
| `cluster`         | string    | query | The cluster where the service is deployed.        |
| `namespace`       | string    | query | The namespace where the service is deployed.      |

Supported Media Types: `text/plain`

**Request example**:

`curl http://localhost:8000/api/services/hello-world-service-1?provider=local&cluster=minikube&namespace=default`

**Response example**:
    
    Status: 200 OK

    Body: "Service is running at: http://localhost:8080."

### Possible Status Code responses

    200, 404


## List Running Services

Lists running services.

`GET /api/services?provider={provider}&cluster={cluster}&namespace={namespace}`

### Parameters

| Name              | Type      | In    | Description                                                   |
|:-----------------:|:---------:|:-----:| :------------------------------------------------------------:|
| `provider`        | string    | query | The name of the provider.                                     |
| `cluster`         | string    | query | The cluster in which to search for services.                  |
| `namespace`       | string    | query | The namespace inside the cluster to search for the services.  |

Supported Media Types: `application/json`

**Request example**:

`curl http://localhost:8000/api/services?provider=local&cluster=minikube&namespace=default`

**Response example**:
    
    Status: 200 OK

    Body:

    {
        "services": [
            {
                "name": "hello-world-service-1",
                "provider": "local",
                "cluster": "minikube",
                "namespace": "default"
            },
            {
                "name": "hello-world-service-2",
                "provider": "local",
                "cluster": "minikube",
                "namespace": "default"
            }
        ]
    }

### Possible Status Code responses

    200
