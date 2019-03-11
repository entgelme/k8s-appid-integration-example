# k8s-appid-integration-example

This example demonstrates a single page app (SPA), using a backend, both residing in individual containers in IBM Kubernetes Service, with an ingress to control incoming requests, and BOTH protected by AppID commonly and transparently.

A general pattern when securing an SPA, is not to secure the SPA itself, but the backend it is using. This presumes, that sensitive data should be stored only on the backend.
See this [blog](https://www.ibm.com/blogs/bluemix/2018/04/securing-angularnode-js-applications-using-app-id/) for a short discussion about that security pattern.


To its extend, there may exist additional requirements to protect the SPA itself including its scripts from unauthorized access. Imagine, your are just developing a very cool and very innovative app, but you don't want anyone to see it or even get aware of what secret and fancy stuff you are working on, until your prototype is mature enough to being demonstrated to the public. Until then, you want to give access to the SPA only to the handfull of your team mates, so that they could review and test it. 

As there are similar examples already existing - which, by the way, provided the inspiration - this example provides the two application parts as distinct containers, which again is a good practice in a microservices world. Then, both parts - not only the backend resources - are protected in common, and the protection is introduced (nearly) transparently by integrating AppID with a K8s ingress. With the small exception of providing a short callback, the application code doesn't have to care about the entire authentication and authorization flow. 

You might ask:
> *"I just had a look to the code and I saw both the frontend and the backend in this
> example explicitly deal with the user authentication. 
> Why do you say, it's transparent for them?"*

The answer is: we just wanted to show the effect to you. 

The code demonstrates, how frontend and backend can derive the information about the currently logged in user - IF, and ONLY IF you want that :blush: - and - AFTER the actual authentication and authorization flow has been processed. 
This is something, that can be done by the app, especially the backend, by just reading the information from the http request header. The frontend then gets the information from the backend via the API. 


# Solution steps
1. [Setup the backend](https://github.com/entgelme/k8s-appid-integration-example/tree/master/hello)
1. [Setup the frontend](https://github.com/entgelme/k8s-appid-integration-example/tree/master/hello-front)

## Credits
I reused and reworked some code from these sources:

[Tutorial: Deploying apps into Kubernetes clusters](https://console.bluemix.net/docs/containers/cs_tutorials_apps.html#cs_apps_tutorial)

[IBM Cloud Blog > How-tos > Creating Spring Boot applications with App ID](https://www.ibm.com/blogs/bluemix/2018/06/creating-spring-boot-applications-app-id/)

[Securing Angular+Node.js Applications using App ID](https://www.ibm.com/blogs/bluemix/2018/04/securing-angularnode-js-applications-using-app-id/)

Special thanks therefore to the colleagues who provided the K8s tutorial, and Eduardo Rodriguez, as well as Anup Rokkam Pratap, and Gelareh Taban for the frontend code basis and the inspiration.
