# Hello Frontend SPA

## Content
Contains a single HTML page in /public/index.html, that uses jquery to receive the identity token information from the backend.

## Howto prepare and start the frontend

### Prerequisites
* IBM Cloud Account (PAYG or subscription, but not Lite)
* IBM Kubernetes Service (IKS) Cluster (Standard, not Lite) 
The reason is, that we want to use an ingress, which is only usable with an IKS standard cluster. 

* IBM Cloud CLI
* IBM Kubernetes Service CLI plugin
* Docker
* git
* npm

See the backend setup description for the following components

* an ingress that forwards http requests to /hello/... to this frontend 
* a configured AppID service, which is bound to the k8s cluster

### Login to the cluster, and the image registry

```script
(set your preferred region instead of eu-de in the URL)

ic login -a https://api.eu-de.bluemix.net      
ic target -g <resource group where the cluster resides>

(only with the first login)
ic ks init              

`ic ks cluster-config <cluster name> |grep KUBECONFIG`
ic cr login
```

### Extend the AppID configuration

### Create the frontend container and the ingress
Set BX_REGISTRY and NAMESPACE in the ./build_run.sh script
On the command line call
> ./build_run.sh




