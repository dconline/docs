---
date: 2018-05-14 10:36:39
title: Kubernetes 使用指南
author: Liang Suilong <liangsuilong@gmail.com>
type: post
tags: 
  - kubernetes
---
## 目录
-----

* [安装 Kubeadm 和 Docker] (#install-kubeadm-and-docker)
* [设置 Cgroup 驱动] (#set-cgroup-driver)
* [初始化 Kubernetes] (#initial-kubernetes)
* [增加 Kubernetes 节点] (#add-kubernetes-node)
* [删除 Kubernetes 节点] (#delete-kubernetes-node)
* [安装 Kubernetes Dashboard] (#install-kubernetes-dashboard)
* [创建 Dashboard RBAC] (#create-dashboard-rbac)
  
## <a name="install-kubeadm-and-docker"></a> 安装 Kubeadm 和 Docker
-----

在主节点执行以下命令

```
apt-get update && apt-get install -y apt-transport-https curl
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb http://apt.kubernetes.io/ kubernetes-xenial main
EOF
apt-get update
apt-get install -y kubelet kubeadm kubectl docker-engine
```
Google 的 Kubernetes 仓库包含一个版本要求最低的 `docker-engine`，不建议使用最新版本的 Docker，避免与 Kubernetes 产生不兼容。

## <a name="set-cgroup-driver"></a> 设置 Cgroup 驱动
-----

Kubeadm 完成安装后，需要确保 `kubelet` 与 Docker 使用相同的 `cgroup driver`。默认 `kubelet` 使用 `systemd`，`docker 使用 `cgroupfs`，因此需要把 `kubelet` 也改成 `cgroupfs`。

打开 `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` 添加两个内容，并保存。

* `Environment="KUBELET_CGROUP_ARGS=--cgroup-driver=systemd"`
* 在 `ExecStart` 后面添加 `$KUBELET_CGROUP_ARGS`

![Kubelet systemd unit](/images/kubelet-systemd-unit.png)

修改完成后，执行以下命令重新加载 `systemd` 配置。

```
systemctl daemon-reload
```

## <a name="initial-kubernetes"></a> 初始化 Kubernetes
-----

执行以下命令，初始化 `Kubernetes`

```
kubeadm init --pod-network-cidr=10.244.0.0/16
```

`Kubelet` 马上在后台开始下载各个 `Docker` 镜像，并自动执行初始化操作。

`kubeadm` 完成初始化后，设置kubectl的配置文件，使用Kubernetes Cluster集群。

![Kubernetes 初始化](/images/kubernetes-initial.png)

```
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

## <a name="deploy-network-plugin"></a> 部署网络插件
-----

初始化完成以后，`Kubernetes` 默认没有部署网络插件，这会导致创建 `Pod` 和 `Service` 直接的网络无法互通，以及各节点之间上的 `Pod` 和 `Service` 也无法网络互通。因此需要搭建一个 `CNI` 网络。`CNI` 网络插件有 `Flannel`，`Calico` 等。这里选用 `Flannel`。

```
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/k8s-manifests/kube-flannel-rbac.yml
```

执行完成后，`Kubernetes` 各个节点的状态从 `NotReady` 变成 `Ready`。此时创建各个 `Pod` 和 `Service` 也能网络互联。

## <a name="add-kubernetes-node"></a> 增加 Kubernetes 节点
-----

增加节点。如前文所述，在其他节点安装好 `kubeadm` 和 `docker-engine`，调整好 `cgroup driver`，执行 `kubeadm join` 命令

```
kubeadm join --token <token> <master-ip>:<master-port> --discovery-token-ca-cert-hash sha256:<hash>
```

稍等片刻，`kubeadm` 会自动配置好节点集群信息和 `Flannel` 网络。等到完成以后，新节点会显示 `Ready` 状态。

![Kubernetes 节点状态](/images/kubernetes-node-status.png)

## <a name="delete-kubernetes-node"></a> 删除 Kubernetes 节点
-----

删除 Kubernetes 需要在 Master 节点和 Slave 节点进行两步操作。

在 Master 节点执行：

```
kubectl drain k8s2 --delete-local-data --force --ignore-daemonsets
kubectl delete node k8s2
```
在 k8s2 节点执行：

```
kubeadm reset
ifconfig cni0 down
ip link delete cni0
ifconfig flannel.1 down
ip link delete flannel.1
rm -rf /var/lib/cni/
```
## <a name="install-kubernetes-dashboard"></a> 安装 Kubernetes Dashboard
-----

执行以下命令安装 Kubernetes Dashboard。

```
kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/v1.8.1/src/deploy/recommended/kubernetes-dashboard.yaml
```

稍等片刻，等待后台下载和自动设置。

## <a name="create-dashboard-rbac"></a> 创建 Dashboard RBAC
-----

`kubernetes-dashboard.yaml` 文件中的 `ServiceAccount` `kubernetes-dashboard` 只有相对较小的权限，因此我们创建一个 `kubernetes-dashboard-admin` 的 `ServiceAccount` 并授予集群 `admin` 的权限，创建 `kubernetes-dashboard-admin.rbac.yaml`：


```
---
apiVersion: v1
kind: ServiceAccount
metadata:
  labels:
    k8s-app: kubernetes-dashboard
  name: kubernetes-dashboard-admin
  namespace: kube-system
  
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: kubernetes-dashboard-admin
  labels:
    k8s-app: kubernetes-dashboard
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: kubernetes-dashboard-admin
  namespace: kube-system
```

执行以下命令，创建 Dashboard RBAC。

`kubectl create -f kubernetes-dashboard-admin.rbac.yaml`


获取 Kubernetes Dashboard `token`。通过 `token` 打开 Dashboard 的 Web 界面对 Kubernetes Cluster 进行管理。

第一步获取 `secret` 容器名称：

`kubectl -n kube-system get secret | grep kubernetes-dashboard-admin`

```
kubernetes-dashboard-admin-token-pfss5   kubernetes.io/service-account-token   3         14s
```

第二步获取最终 `token`：

`kubectl describe -n kube-system secret/kubernetes-dashboard-admin-token-pfss5`

```
Name:         kubernetes-dashboard-admin-token-pfss5
Namespace:    kube-system
Labels:       <none>
Annotations:  kubernetes.io/service-account.name=kubernetes-dashboard-admin
              kubernetes.io/service-account.uid=1029250a-ad76-11e7-9a1d-08002778b8a1

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     1025 bytes
namespace:  11 bytes
token:      eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZC1hZG1pbi10b2tlbi1wZnNzNSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJrdWJlcm5ldGVzLWRhc2hib2FyZC1hZG1pbiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjEwMjkyNTBhLWFkNzYtMTFlNy05YTFkLTA4MDAyNzc4YjhhMSIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlLXN5c3RlbTprdWJlcm5ldGVzLWRhc2hib2FyZC1hZG1pbiJ9.Bs6h65aFCFkEKBO_h4muoIK3XdTcfik-pNM351VogBJD_pk5grM1PEWdsCXpR45r8zUOTpGM-h8kDwgOXwy2i8a5RjbUTzD3OQbPJXqa1wBk0ABkmqTuw-3PWMRg_Du8zuFEPdKDFQyWxiYhUi_v638G-R5RdZD_xeJAXmKyPkB3VsqWVegoIVTaNboYkw6cgvMa-4b7IjoN9T1fFlWCTZI8BFXbM8ICOoYMsOIJr3tVFf7d6oVNGYqaCk42QL_2TfB6xMKLYER9XDh753-_FDVE5ENtY5YagD3T_s44o0Ewara4P9C3hYRKdJNLxv7qDbwPl3bVFH3HXbsSxxF3TQ
```

