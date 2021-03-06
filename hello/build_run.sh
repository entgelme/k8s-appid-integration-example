#!/bin/sh -x
# Log in ONCE:
# ic login -a https://api.eu-de.bluemix.net      (set your preferred region instead of eu-de in the URL)
# ic target -g <resource group where the cluster resides>
# ic ks init              (only with the first login)
# `ic ks cluster-config <cluster name> |grep KUBECONFIG`
# ic cr login

# Change the names of the Container image registry BX_REGISTRY 
# and the k8s NAMESPACE to deploy to according to your needs:
BX_REGISTRY=<region>.icr.io/<registry namespace>
echo Using registry $BX_REGISTRY

NAMESPACE=default
echo Using k8s namespace $NAMESPACE


# build and push to IBM Cloud Private container image registry
docker build -t $BX_REGISTRY/hello-world:v1 .
docker push $BX_REGISTRY/hello-world:v1 

# Create k8s deployment
kubectl delete svc,rc,deployments,pods -l app=hello-world -l tier=backend -n $NAMESPACE
rm depltmp.yml
cat deployment.yml | sed s,"\$IMAGE",$BX_REGISTRY"/hello-world:v1",>depltmp.yml
kubectl create -f depltmp.yml -n $NAMESPACE

# Create/Update ingress
kubectl apply -f helloingress.yml -n $NAMESPACE



