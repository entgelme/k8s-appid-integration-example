# k8s-appid-integration-example
This example demonstrates a single page app, using a backend, both residing in individual containers in IBM Kubernetes Service, with an ingress to control incoming requests, and protected by AppID transparently.

As there are similar examples already existing - which, by the way, provided the inspiration - this example provides the two application parts as distinct containers. Then, both parts - not only the backend resources - are protected, and the protection is introduced (nearly) transparently by integrating AppID with a K8s ingress. With the small exception of providing a short callback, the application code doesn't have to care about the entire authentication and authorization flow. 

You might ask:
> *"But both the frontend and the backend in this example explicitly deal with the 
> user authentication. Why do you say, it's transparent for them?"*

We just wanted to demonstrate, how frontend and the backend can derive the information about the currently logged in user - IF you want that. :-) 
This is something, that can be done by the app, especially the backend, by just reading the information from the http request header. The frontend then gets the information from the backend via the API. But all this happens, AFTER the actual authentication and authorization flow has been processed, and that has been done by the AppID service (in collaboration with the k8s ingress) before. No app code had to be written for that.


# Solution steps
1. [Setup the backend] (https://github.com/entgelme/k8s-appid-integration-example/tree/master/hello)
1. [Setup the frontend] (https://github.com/entgelme/k8s-appid-integration-example/tree/master/hello-front)

## Credits
I reused and reworked some code from these sources:

[Tutorial: Deploying apps into Kubernetes clusters] (https://console.bluemix.net/docs/containers/cs_tutorials_apps.html#cs_apps_tutorial)

[IBM Cloud Blog > How-tos > Creating Spring Boot applications with App ID] (https://www.ibm.com/blogs/bluemix/2018/06/creating-spring-boot-applications-app-id/)

[Securing Angular+Node.js Applications using App ID] (https://www.ibm.com/blogs/bluemix/2018/04/securing-angularnode-js-applications-using-app-id/)

Special thanks therefore to the colleagues who provided the K8s tutorial, and Eduardo Rodriguez, as well as Anup Rokkam Pratap, and Gelareh Taban for the frontend code basis and the inspiration.
