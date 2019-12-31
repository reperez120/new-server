module.exports = {
    apps: [{
      name: 'new-server',
      script: './index.js'
    }],
    deploy: {
      production: {
        user: 'ubuntu',
        host: 'ec2-18-221-195-24.us-east-2.compute.amazonaws.com',
        key: '~/.ssh/w.pem',
        ref: 'origin/master',
        repo: 'git@github.com:reperez120/new-server.git',
        path: '/home/ubuntu/new-server',
        'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
      }
    }
  }