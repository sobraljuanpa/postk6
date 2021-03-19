node {
    stage('Pull changes') {
        git branch: 'main', url: 'https://github.com/sobraljuanpa/postk6.git'
    }
    
    stage('Deploy app locally') {
        sh 'cd app && yarn install --production'
        sh 'cd app && node src/index.js &'
    }
    
    stage('Run performance tests') {
        sh 'k6 run --vus 1600 --iterations 1600 script.js'
    }
    
    stage('Stop app') {
        sh 'killall node'
    }
    
    stage('Report results') {
        
    }
}