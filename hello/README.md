# The hello Backend

## API functions
It provides an API with these functions

* /api/user
  Reads the identity token from the http request header and returns it.
  Basically, the token contains information about the current logged in user.

* /api/login
  not implemented yet

* /api/logout
  not implemented yet

* /api/user/appid_callback
  a callback that may be called by the AppID service during the OAuth/OICD authorization flow.

## Howto prepare and start the backend

### Prerequisites
* [IBM Cloud](https://cloud.ibm.com) Account (PAYG or subscription, but not Lite)
* [IBM Kubernetes Service (IKS) Cluster (Standard, not Lite)](https://console.bluemix.net/containers-kubernetes/catalog/cluster) 
  The reason is, that we want to use an ingress, which is only usable with an IKS standard cluster. 

* [IBM Cloud Container Registry](https://console.bluemix.net/containers-kubernetes/launchRegistryView)
* [IBM Cloud CLI](https://console.bluemix.net/docs/cli/reference/ibmcloud/download_cli.html#install_use) 
* [IBM Kubernetes Service and IBM Cloud Container Registry CLI plugins](https://console.bluemix.net/docs/cli/reference/ibmcloud/extend_cli.html#plug-ins)
* [Docker](https://docs.docker.com/install/)
* [git](https://git-scm.com/downloads)
* [node.js and npm](https://nodejs.org)

To ensure that you have the latest version of plugins used in this tutorial, use 

```script
ic plugin update --all 
```

to upgrade.

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

### Create an AppID service and bind it to the k8s cluster

Create an [App ID service](https://console.bluemix.net/catalog/services/AppID) instance. 
```script
ic resource service-instance-create <appid service instance name> appid lite <region> 
```
Optionally, add `-g <resource group name>`, if you want the service instance to reside in a resource group other than `default`.

Bind the service instance to your k8s cluster.
```script
ic ks cluster-service-bind --cluster <cluster name> --namespace <k8s namespace> --service <appid service instance name>

```
That will create a new Service ID in IBM Cloud, which contains the credentials to access the App ID service. This Service ID content is then filled in to a new k8s secret. Finally, the command returns the name of this secret.

```script
Secret Name:   binding-<appid service instance name> 
```

### Setup your ingress 

Load `helloingress.yml` in an editor. 

1. Set the name of the secret containing the App ID credentials

In the setting for the value of 

> metadata.annotations.ingress.bluemix.net/appid-auth

replace the bindsecret value with the secret name you gained from the `ic ks cluster-service-bind ...`command in the previous step.

Later, when the ingress receives a request to a protected k8s service, it can use the credentials from the bindsecret to access the App ID service in order to start the authentication flow.

1. Set the k8s namespace, where the services (hello frontend and backend) reside

In the setting for the value of 

> metadata.namespace

replace the value with the namespace, where your containers for backend and frontend shall reside.


1. Set hostname for routing rules and tls termination 

Determine the ingress subdomain

```script
ic ks cluster-get <cluster name>
Retrieving cluster <cluster name>...
OK
...
Ingress Subdomain:      <cluster name>.<region>.containers.appdomain.cloud
Ingress Secret:         <secret name>   
...
```
Replace the values (<cluster name>.<region>.containers.appdomain.cloud) of the entries
> spec.rules[0].host
and
> spec.tls.hosts[0]

with the `Ingress Subdomain` name you derived from the `ic ks cluster-get` command before.

1. Set the secret for tls termination
Replace the placeholder in the entry 
> spec.tls.secretName

with the `Ingress Secret` name you derived from the `ic ks cluster-get` command before.

Save your changes to `helloingress.yml`.


### Set up AppID

Open a browser and login to https://cloud.ibm.com 
In the IBM Cloud dashboard, in the section `Services` locate the App ID service you just created. Click on it to open the service dashboard. 

Walk through the entries of the menu on the left side of the window.

1. Set identity providers  
In the menu `Identity Providers>Manage` enable the `Identity Providers` of your choice.
For this example, we only describe the setup of your own private cloud directory.

Therefore, ensure that the entry `Cloud Directory` is enabled.

1. Set authentication settings

This optional for the backend resources, when you do the according configuration for the [frontend](https://github.com/entgelme/k8s-appid-integration-example/tree/master/hello-front).

Only if the backend's API service `/api/user` shall be directly accessed, e.g. for test purposes, omitting the frontend, the backend resource callback can be configured.

In the center frame, on the top, click on the `Authentication Settings` tab.
Take the `Ingress Subdomain` name you derived from the `ic ks cluster-get` command before, prepend it with the https scheme, and append the route /api/user/appid_callback. 

Set the resulting string 
> https://<cluster name>.<region>.containers.appdomain.cloud/api/user/appid_callback

to the field `Add web redirect URLs` and click on the `+` button to add that URL.

That url will be used by App ID during the OAuth authentication flow to redirect requests to the target service.

### Create the backend container and the ingress

Open the file `./hello/build_run.sh` in an editor.

Set BX_REGISTRY and NAMESPACE variables in the script to values that reflect your environment. They represent the container image registry, that shall receive the image after the build is finished, and the k8s namespace, which the containers shall be deployed to.

For the registry, you might decide to use the one provided with the IBM Kubernetes service. These have a format like `registry.<region>.bluemix.net/<registry namespace>/`

For more details refer to https://console.bluemix.net/docs/services/Registry .

To execute the backend build, the deployment to the k8s cluster, as well as the ingress deployment, open a command line window.

Change to the subdirectory /hello 

Simply call

```script
./build_run.sh
```
and the rest is done for you.

### Check for successfull deployment
After a successful deployment, you should receive the following output using the command:

```script
$ kubectl get deployments,services,ingress
NAME                    DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
deploy/hello-world      1         1         1            1           1m

NAME                         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
svc/hello-service            ClusterIP   <internal ip>   <none>        8080/TCP   1m
svc/kubernetes               ClusterIP   <internal ip>   <none>        443/TCP    63d

NAME                HOSTS                                             ADDRESS           PORTS     AGE
ing/hello-ingress   <cluster name>.eu-de.containers.appdomain.cloud   <external ip>   80, 443   1m
```

