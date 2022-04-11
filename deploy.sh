docker build -t rudovik/multi-client:latest -t rudovik/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t rudovik/multi-api:latest -t rudovik/multi-api:$SHA -f ./api/Dockerfile ./api
docker build -t rudovik/multi-worker:latest -t rudovik/multi-worker:$SHA -f ./worker/Dockerfile ./worker
docker push rudovik/multi-client:latest
docker push rudovik/multi-api:latest
docker push rudovik/multi-worker:latest
docker push rudovik/multi-client:$SHA
docker push rudovik/multi-api:$SHA
docker push rudovik/multi-worker:$SHA
kubectl apply -f k8s
kubectl set image deployments/server-deployment server=rudovik/multi-api:$SHA
kubectl set image deployments/client-deployment client=rudovik/multi-client:$SHA
kubectl set image deployments/worker-deployment worker=rudovik/multi-worker:$SHA