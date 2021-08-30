def app_name
def app_ver
def replaceAppHelmDeploy(String app_name,String app_ver){
        
        app_image = app_name+':'+ app_ver
        sh "sed -i s/APP_NAME/${app_name}/g npm-deploy/values.yaml"
        sh "sed -i s/NAMESPACE/${AWS_EKS_NAMESPACE}/g npm-deploy/values.yaml"
        sh "sed -i s/DOCKER_SERVER/${DOCKER_AWS_SERVER}/g npm-deploy/values.yaml"
        sh "sed -i 's/APP_IMAGE/${app_image}/g' npm-deploy/values.yaml"
        sh "sed -i s/HOSTNAME/${app_name}/g npm-deploy/values.yaml"
        sh "sed -i s/REPLICAS/1/g npm-deploy/values.yaml"
}

def deployHelmChart(String app_name){   
        sh "helm upgrade --install  --recreate-pods ${app_name} npm-deploy --namespace ${AWS_EKS_NAMESPACE}"
}

def connectAws(){
        sh "aws eks --region ${AWS_DEFAULT_REGION} update-kubeconfig --name ${AWS_EKS_CLUSTER_NAME}"           
}

pipeline {
  agent any
  stages {
    stage('Build Image') {
      steps {
        // Capture the values w.r.t application
              script {
        def pkg = readJSON file: 'package.json'
        app_name = pkg.name.toString().toLowerCase()
        // Code added to nullify the issues with underscore ( _ ) , while creating DNS entry.              
        if (app_name.contains("_")) {
          app_name = app_name.replace("_", "-");
         }              
        app_ver  = pkg.version             
        sh "sudo docker build -t $DOCKER_AWS_SERVER/$app_name:$app_ver ."
              }
      }
    }
    stage('Push Image') {
      steps {
              // Login to AWS ECR Registry
              sh "aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | sudo docker login --username AWS --password-stdin ${DOCKER_AWS_SERVER}"
              // Create a new repository for each application , if it doesn't exist
              sh "aws ecr describe-repositories --repository-names ${app_name} || aws ecr create-repository --repository-name ${app_name}"
              // Push the image to AWS ECR
              sh "sudo docker push ${DOCKER_AWS_SERVER}/$app_name:$app_ver"
      }
    }
    stage('Deploy') {
      steps {
        // Replace the values in the values.yaml   
        connectAws()      
        replaceAppHelmDeploy("$app_name","$app_ver")
        deployHelmChart("$app_name")
        
      }
    }
  }
  environment {
    DOCKER_AWS_SERVER = credentials('DOCKER_AWS_SERVER')
    AWS_ACCESS_KEY_ID = credentials('AWS_EKSCICD_KEY_ID')
    AWS_SECRET_ACCESS_KEY = credentials('AWS_EKSCICD_SECRET_KEY')
    AWS_DEFAULT_REGION= 'us-east-1'
    AWS_EKS_CLUSTER_NAME= 'techforce-test1'
    AWS_EKS_NAMESPACE = 'tfai-saas'      
  }
}
