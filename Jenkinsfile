/* Requires the Docker Pipeline plugin */
pipeline {
	agent { label 'amd64' }

	stages {
		stage('build') {
			/* get commit id and save it as environment variable COMMIT*/
			environment {
				COMMIT = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
				ORSTED_MONGO_URI = credentials('ORSTED_MONGO_URI')
				ORSTED_BOT_TOKEN = credentials('ORSTED_BOT_TOKEN')
				ORSTED_GUILD_ID = credentials('ORSTED_MONGO_URI')
				MONGO_INITDB_ROOT_USERNAME = credentials('MONGO_INITDB_ROOT_USERNAME')
				MONGO_INITDB_ROOT_PASSWORD = credentials('MONGO_INITDB_ROOT_PASSWORD')
			}

			steps {
					/* update with docker compose */
					sh 'docker compose up -d'
			}
		}
		stage ('clean old images') {
			steps {
				/* clean old images */
				sh 'docker image prune -f'
			}
		}
	}
}


