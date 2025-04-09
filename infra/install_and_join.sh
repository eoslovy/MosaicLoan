#!/bin/bash
##sudo bash install_and_join.sh "kubeadm join 1.2.3.4:6443 --token abcdef.0123456789abcdef --discovery-token-ca-cert-hash sha256:xxxxx"
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 \"<kubeadm join ...>\""
  exit 1
fi

JOIN_CMD="$1"

echo "[1] Docker 설치 중..."
apt update
apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
  > /etc/apt/sources.list.d/docker.list

apt update
apt install -y docker-ce docker-ce-cli containerd.io
systemctl enable docker
systemctl start docker

echo "[2] Kubernetes 설치 중..."
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
apt-add-repository "deb http://apt.kubernetes.io/ kubernetes-xenial main"
apt update
apt install -y kubelet kubeadm kubectl
apt-mark hold kubelet kubeadm kubectl
systemctl enable kubelet
systemctl start kubelet

echo "[3] 클러스터 조인 중..."
$JOIN_CMD

echo "[✔] 조인 완료. 노드 준비 끝."