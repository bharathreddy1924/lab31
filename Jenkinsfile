def runCmd(String unixCommand, String windowsCommand = null) {
  if (isUnix()) {
    sh unixCommand
  } else {
    bat(windowsCommand ?: unixCommand)
  }
}

pipeline {
  agent any

  options {
    disableConcurrentBuilds()
    timestamps()
  }

  environment {
    COMPOSE_PROJECT_NAME = "lab27-ci-${BUILD_NUMBER}"
    FRONTEND_PORT = "3002"
    BACKEND_PORT = "5001"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      parallel {
        stage('Backend dependencies') {
          steps {
            dir('backend') {
              script {
                runCmd('npm ci')
              }
            }
          }
        }

        stage('Frontend dependencies') {
          steps {
            dir('frontend') {
              script {
                runCmd('npm ci')
              }
            }
          }
        }
      }
    }

    stage('Test') {
      parallel {
        stage('Backend test') {
          steps {
            dir('backend') {
              script {
                runCmd('npm test')
              }
            }
          }
        }

        stage('Frontend test') {
          steps {
            dir('frontend') {
              script {
                runCmd('CI=true npm test -- --watchAll=false', 'set CI=true&& npm test -- --watchAll=false')
              }
            }
          }
        }
      }
    }

    stage('Build frontend') {
      steps {
        dir('frontend') {
          script {
            runCmd('npm run build')
          }
        }
      }
    }

    stage('Docker build') {
      steps {
        script {
          runCmd('docker compose build')
        }
      }
    }

    stage('Docker smoke test') {
      steps {
        script {
          runCmd('docker compose up -d')
          runCmd('docker compose ps')
        }
      }
    }
  }

  post {
    always {
      script {
        runCmd('docker compose down -v --remove-orphans || true', 'docker compose down -v --remove-orphans')
      }
    }
  }
}
