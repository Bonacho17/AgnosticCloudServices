/* See https://jsonforms.io for more information on how to configure data and ui schemas. */

export const serviceView = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Control',
      'label': 'Service',
      'scope': '#/properties/name'
    },
    {
      'type': 'Group',
      'label': 'Service Configuration',
      'elements': [
        {
          'type': 'VerticalLayout',
          'elements': [
            {
              'type': 'HorizontalLayout',
              'elements': [
                {
                  'type': 'HorizontalLayout',
                  'elements': [
                    {
                      'type': 'Control',
                      'label': 'Service Name',
                      'scope': '#/properties/serviceConfig/properties/serviceName'
                    }
                  ]
                }
              ]
            },
            {
              'type': 'HorizontalLayout',
              'elements': [
                {
                  'type': 'HorizontalLayout',
                  'elements': [
                    {
                      'type': 'Control',
                      'label': 'Port',
                      'scope': '#/properties/serviceConfig/properties/port'
                    },
                    {
                      'type': 'Control',
                      'label': 'Protocol',
                      'scope': '#/properties/serviceConfig/properties/protocol',
                      'rule': {
                        'effect': 'DISABLE',
                        'condition': {
                          'scope': '#/properties/serviceConfig/properties/advancedConfiguration',
                          'schema': {
                            'const': false
                          }
                        }
                      }
                    },
                    {
                      'type': 'Control',
                      'label': 'Service Type',
                      'scope': '#/properties/serviceConfig/properties/serviceType',
                      'rule': {
                        'effect': 'DISABLE',
                        'condition': {
                          'scope': '#/properties/serviceConfig/properties/advancedConfiguration',
                          'schema': {
                            'const': false
                          }
                        }
                      }
                    }
                  ]
                }
              ],
            }
          ]
        }
      ]
    },
    {
      'type': 'Group',
      'label': 'Container',
      'elements': [
        {
          'type': 'HorizontalLayout',
          'elements': [
            {
              'type': 'Control',
              'label': 'Container Image Path',
              'scope': '#/properties/container/properties/containerImagePath'
            }
          ]
        },
        {
          'type': 'VerticalLayout',
          'elements': [
            {
              'type': 'Control',
              'scope': '#/properties/container/properties/envs',
              'label': 'Environment Variables',
              'options': {
                'showSortButtons': false
              }
            }
          ]
        }
      ]
    },
    {
      'type': 'Group',
      'label': 'Cloud Provider',
      'elements': [
        {
          'type': 'VerticalLayout',
          'elements': [
            {
              'type': 'HorizontalLayout',
              'elements': [
                {
                  'type': 'Control',
                  'label': 'Vendor',
                  'scope': '#/properties/cloudProvider/properties/vendor'
                }
              ]
            },
            {
              'type': 'Group',
              'label': 'Kubernetes Settings',
              'elements': [
                {
                  'type': 'HorizontalLayout',
                  'elements': [
                    {
                      'type': 'Control',
                      'label': 'Cluster',
                      'scope': '#/properties/cloudProvider/properties/cluster'
                    },
                    {
                      'type': 'Control',
                      'label': 'Namespace',
                      'scope': '#/properties/cloudProvider/properties/namespace'
                    },
                  ]
                }
              ],
            },
            {
              "type": "Group",
              "elements": [
                {
                  "type": "Control",
                  "label": "Service Migration?",
                  "scope": "#/properties/cloudProvider/properties/migration"
                },
                {
                  "type": "Control",
                  "label": "Target Vendor",
                  "scope": "#/properties/cloudProvider/properties/vendor_to",
                  "rule": {
                    "effect": "HIDE",
                    "condition": {
                      "scope": "#/properties/cloudProvider/properties/migration",
                      "schema": {
                        "const": false
                      }
                    }
                  }
                },
                {
                  'type': 'Group',
                  'label': 'Kubernetes Settings',
                  'elements': [
                    {
                      'type': 'HorizontalLayout',
                      'elements': [
                        {
                          'type': 'Control',
                          'label': 'Target Cluster',
                          'scope': '#/properties/cloudProvider/properties/cluster_to'
                        },
                        {
                          'type': 'Control',
                          'label': 'Target Namespace',
                          'scope': '#/properties/cloudProvider/properties/namespace_to'
                        },
                      ]
                    }
                  ],
                  "rule": {
                    "effect": "HIDE",
                    "condition": {
                      "scope": "#/properties/cloudProvider/properties/migration",
                      "schema": {
                        "const": false
                      }
                    }
                  }
                },
              ]
            }
          ]
        }
      ]
    }
  ]
};

export const deploymentView = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Control',
      'label': 'Deployment',
      'scope': '#/properties/name'
    }
  ]
};

export const deploymentSchema = {
  'definitions': {
    'deployment': {
      'title': 'Deployment',
      'type': 'object',
      'properties': {
        'typeId': {
          'const': 'Deployment'
        },
        'name': {
          'type': 'string',
          'minLength': 5,
          'maxLength': 50
        }
      },
      'required': ['name'],
      'additionalProperties': false
    },
    'service': {
      'title': 'Service',
      'type': 'object',
      'properties': {
        'typeId': {
          'const': 'Service'
        },
        'name': {
          'type': 'string',
          'minLength': 5,
          'maxLength': 50
        },
        'serviceConfig': {
          '$ref': '#/definitions/serviceConfig'
        },
        'cloudProvider': {
          '$ref': '#/definitions/cloudProvider'
        },
        'container': {
          '$ref': '#/definitions/container'
        }
      },
      'additionalProperties': false,
      'required': [
        'serviceConfig',
        'cloudProvider',
      ]
    },
    'serviceConfig': {
      'type': 'object',
      'title': 'Service Configuration',
      'properties': {
        'typeId': {
          'const': 'ServiceConfig'
        },
        'port': {
          'type': 'integer',
          'minimum': 1,
          'maximum': 9999
        },
        'serviceName': {
          'type': 'string',
          'minLength': 3,
          'maxLength': 30,
        },
        'serviceType': {
          'type': 'string',
          'enum': [
            'Load Balancer',
            'Node Port',
            'Cluster IP'
          ]
        },
        'protocol': {
          'type': 'string',
          'enum': [
            'TCP',
            'UDP'
          ]
        }
      },
      'required': [
        'port'
      ],
      'additionalProperties': false
    },
    'cloudProvider': {
      'title': 'Cloud Provider',
      'type': 'object',
      'properties': {
        'typeId': {
          'const': 'CloudProvider'
        },
        'vendor': {
          'type': 'string',
          'enum': [
            'Microsoft Azure',
            'Google Cloud Platform',
            'Amazon Web Services',
            'On-premises'
          ]
        },
        'cluster': {
          'type': 'string',
          'minLength': 3,
        },
        'namespace': {
          'type': 'string',
          'minLength': 3,
        },
        'migration': {
          'type': 'boolean'
        },
        'vendor_to': {
          'type': 'string',
          'enum': [
            'Microsoft Azure',
            'Google Cloud Platform',
            'Amazon Web Services',
            'On-premises'
          ]
        },
        'cluster_to': {
          'type': 'string',
          'minLength': 3,
        },
        'namespace_to': {
          'type': 'string',
          'minLength': 3,
        },
      },
      'required': [
        'vendor',
        'cluster',
        'namespace'
      ],
      'additionalProperties': false
    },
    'container': {
      'type': 'object',
      'title': 'Container',
      'properties': {
        'typeId': {
          'const': 'Container'
        },
        'containerImagePath': {
          'type': 'string'
        },
        'envs': {
          'type': 'array',
          'items': {
            'type': 'object',
            'properties': {
              'name': {
                'type': 'string'
              },
              'value': {
                'type': 'string'
              }
            }
          }
        }
      },
      'required': [
        'containerImagePath'
      ],
      'additionalProperties': false
    }
  },
  '$ref': '#/definitions/deployment'
};
