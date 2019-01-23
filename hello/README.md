# The hello backend

## API functions
It provides an API with these functions

/api/user
Reads the identity token from the http request header and returns it.
Basically, the token contains information about the current logged in user.

/api/login
not implemented yet

/api/logout
not implemented yet

/api/user/appid_callback
a callback that may be called by the AppID service during the OAuth/OICD authorization flow.

## Howto prepare and start the backend

### Prerequisites
* IBM Cloud Account (PAYG or subscription, but not Lite)
* IBM Kubernetes Service (IKS) Cluster (Standard, not Lite) 
The reason is, that we want to use an ingress, which is only usable with an IKS standard cluster. 

* IBM Cloud CLI
* IBM Kubernetes Service CLI plugin
* Docker
* git
* npm

### Prepare a tls connection to the cluster
Create a certificate
Load the certificate to a k8s secret
Set the secret name in the ingress definition 

### Login to the cluster, and the image registry

### Create an AppID service and bind it to the k8s cluster

### Set up AppID

### Create the backend container and the ingress
Set BX_REGISTRY and NAMESPACE in the ./build_run.sh script
On the command line call
> ./build_run.sh



