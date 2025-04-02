#!/bin/bash

# 1. 대시보드 설치 (최신 stable)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml

# 2. admin 사용자용 ServiceAccount 및 ClusterRoleBinding 생성
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: admin-user
    namespace: kubernetes-dashboard
EOF

# 3. 토큰 출력 (로그인용)
echo ""
echo "🔑 로그인 토큰:"
kubectl -n kubernetes-dashboard create token admin-user

# 4. 포트포워딩 (로컬접속용)
echo ""
echo "🌐 웹 대시보드 접속: http://localhost:8001/"
kubectl port-forward -n kubernetes-dashboard svc/kubernetes-dashboard 8001:443
