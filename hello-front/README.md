# The Hello Frontend SPA

## Content
Contains a single HTML page in /public/index.html, that uses jquery to receive the identity token information from the backend.

## Howto prepare and start the frontend

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

See the [backend setup](https://github.com/entgelme/k8s-appid-integration-example/tree/master/hello) description for the following components

* an ingress that forwards http requests to /hello/... to this frontend 
* a configured AppID service, which is bound to the k8s cluster

### Login to the cluster, and the image registry

If you are not already logged in to IBM Cloud, log in now.

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

Return to the App ID management dashboard. If not already open in a browser, open the [IBM Cloud dashboard](https://cloud.ibm.com), then in the section `Services` locate the App ID service you just created. Click on it to open the service's management dashboard. 

In the menu on the left side of the window, click on `Identity Providers>Manage`.
In the center frame, on the top, change to the `Authentication Settings` tab.

Take the `Ingress Subdomain` name, prepend it with the https scheme, and append the route /hello/appid_callback. 

**Note**: the  can be derived by the command `ic ks cluster-get <cluster name>` command before.

Set the resulting string 
> https://\<cluster name>.\<region>.containers.appdomain.cloud/hello/appid_callback

to the field `Add web redirect URLs` and click on the `+` button to add that URL.

That url will be used by App ID during the OAuth authentication flow to redirect requests to the target service.


### Create the frontend container and the ingress
Open the file `./hello-front/build_run.sh` in an editor.

Set BX_REGISTRY and NAMESPACE variables in the script to values that reflect your environment. They represent the container image registry, that shall receive the image after the build is finished, and the k8s namespace, which the containers shall be deployed to.

For the registry, you might decide to use the one provided with the IBM Kubernetes service. These have a format like `registry.<region>.bluemix.net/<registry namespace>/`

For more details refer to https://console.bluemix.net/docs/services/Registry .

To execute the frontend build, the deployment to the k8s cluster, as well as the ingress deployment, open a command line window.

Change to the subdirectory `/hello-front` 

Simply call

```script
./build_run.sh
```
and the rest is done for you.

### Check for successfull deployment
After a successful deployment, you should receive the following output using the command:

```script
$ kubectl get deployments,services,ingress -l app=hello-world -l tier=frontend -n default
NAME                    DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
deploy/hello-frontend   1         1         1            1           1m

NAME                         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
svc/hello-frontend-service   ClusterIP   <internal ip>   <none>        8080/TCP   1m

```

Finally, in  a browser, open the frontend SPA at the URL
> https://\<cluster name>.\<region>.containers.appdomain.cloud/hello

You will be redirected to the Login page of the App ID service. After successful login using the user credentials configured in App ID, the original request is redirected back to the original destination /hello. The web app is loading, gets the currently logged in user information from the backend and displays it in the html page.

![hello screenshot](https://github.com/entgelme/k8s-appid-integration-example/blob/master/hello-front/helloscreen.jpg)






