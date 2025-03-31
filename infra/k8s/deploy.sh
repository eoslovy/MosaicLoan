#!/bin/bash
echo "Kind 클러스터 생성 최초 한번만(이미지 캐시 다 지워짐)"
kind create cluster --name mosaic-cluster --config kind-cluster.yml

echo "클러스터 노드 라벨 부여"

kubectl label node mosaic-cluster-control-plane disktype=control
kubectl label node mosaic-cluster-worker disktype=worker
kubectl taint nodes mosaic-cluster-control-plane node-role.kubernetes.io/control-plane- --overwrite

echo "Kind 클러스터 도커 이미지 로딩"
kind load docker-image mosaic/member-api:deploy --name mosaic-cluster
kind load docker-image mosaic/account-api:deploy --name mosaic-cluster
kind load docker-image mosaic/contract-api:deploy --name mosaic-cluster
kind load docker-image mosaic/credit-api:deploy --name mosaic-cluster
kind load docker-image mosaic/mydata-api:deploy --name mosaic-cluster

kind load docker-image mosaic/nginx:deploy --name mosaic-cluster
kind load docker-image mosaic/springcloud-gateway:deploy --name mosaic-cluster
kind load docker-image mosaic/zookeeper:deploy --name mosaic-cluster
kind load docker-image mosaic/kafka:deploy --name mosaic-cluster
kind load docker-image mosaic/redis:deploy --name mosaic-cluster

kind load docker-image mosaic/member-db:deploy --name mosaic-cluster
kind load docker-image mosaic/account-db:deploy --name mosaic-cluster
kind load docker-image mosaic/contract-db:deploy --name mosaic-cluster
kind load docker-image mosaic/credit-db:deploy --name mosaic-cluster
kind load docker-image mosaic/mydata-db:deploy --name mosaic-cluster


set -e

echo "🔧 [1/5] 네임스페이스 생성"
kubectl apply -f namespace.yml


echo "🗄  [2/5] DB 리소스 생성"
kubectl apply -f databases/db-account.yml
kubectl apply -f databases/db-contract.yml
kubectl apply -f databases/db-credit.yml
kubectl apply -f databases/db-member.yml
kubectl apply -f databases/db-mydata.yml


echo "🧱 [3/5] 인프라 서비스 생성"
kubectl apply -f infras/redis.yml
kubectl apply -f infras/kafka.yml
kubectl apply -f infras/gateway.yml
kubectl apply -f infras/nginx-frontend.yml


echo "🚀 [4/5] API 서비스 생성"
kubectl apply -f apis/api-account.yml
kubectl apply -f apis/api-contract.yml
kubectl apply -f apis/api-credit.yml
kubectl apply -f apis/api-member.yml
kubectl apply -f apis/api-mydata.yml


echo "📦 [5/5] 파드 상태 확인"
kubectl get pods -n mosaic