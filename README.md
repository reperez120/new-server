                           Photo Collection AWS Server

This project is an Amazon Web Services (AWS) server that displays a collection of photographs. Below are the instructions for setting up the project.

1. Setting Up the server through AWS

    Once logged into the Amazon Web Services (AWS) console with the appropriate credentials, navigate to "Services" and select Elastic Compute Cloud (EC2).  Select an appropriate Amazon Machine Image (AMI) (this project uses Ubuntu Server).  

    Create an AWS instance. The steps "Configure Instance Details", "Add Storage", and "Add Tags" can be left at the default settings. 

    For the step "Configure Security Group" create a new security group with  a relevant name. Click "Add Rule" select type "HTTP" and add "80" as the Port Range so the app can be served on Port 80.

    Click "Launch"  create a new key pair, and download the key pair.  Save the .pem file of the key in the computer .ssh file. Select "Launch Instance and then View Instances."


2. Connecting to the Instance through the Terminal
    Once the instance is running, open up the terminal, and allow permissions for the key by running
        < $ chmod 400 ~/.ssh/[key-name].pem >

    Connect to the instance in the terminal by running:
        < $ ssh -i ~/.ssh/[key-name].pem     [Public DNS found in the instance details on the AWS console.] >

    Install Node Version Manager (NVM) by running in the terminal:
        <$ curl -o- 
        https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash>

    Run the ~bachrc file by typing in the terminal:
        < $ source ~/.bashrc >

    Install node by running 
        < $ nvm install [latest version number] >

3. Setting up HTTP endpoint
    Create a directory to contain the server and cd into, by running:
        < $ mkdir server  && cd $_ >

    then start npm by running:
        < $npm init >

    Install express by running:
        < $ npm install express --save-dev >

    Create and an index file by running:
        < $ nano index.js >

    Put  basic server code in the index file, which could be made more complex if needed.

        const express = require('express')
        const app = express()

        app.get('/', (req, res) => {
            res.send('Hello, world!')
        })
        app.listen(3000, () => console.log('Server running on port 3000'))

        Start the server by running:
            < $Node index.js >

    To run the app on Port 3000, go back to the EC2 console, go to "Security Groups" right click the security group for this instance, click "edit inbound rules" and click "add rule". Select a "Custom TCP rule" and set the port range to 3000.

    Type crl+z in the terminal to pause the server and to run the server in the background run:
        < $ bg %1 >

4. Setting up Nginx and Connecting to Port 80
    Cd out of the server directory by running
        < $cd -- >
    Install nginx by running:
        < $ sudo apt-get install nginx >

    Remove the default config file by running: 
        < $ sudo rm /etc/nginx/sites-enabled/default >

    Create a  new config file
        < $ sudo nano /etc/nginx/sites-available/config >

    Fill the file with basic config details:
        server {
        listen 80;
        server_name express-server;
        location / {
            proxy_set_header  X-Real-IP  $remote_addr;
            proxy_set_header  Host       $http_host;
            proxy_pass        http://127.0.0.1:3000;
        }
        }

    Link the config file in sites enabled by running:
        < $ sudo ln -s /etc/nginx/sites-available/tutorial /etc/nginx/sites-enabled/config >

    Restart nginx by running:
        < $ sudo service nginx restart >

    If the app is no longer running, start it by running:
        < $ node sever/index.js >

    Pause server by typing:
        ctrl+z 

    resume the app as a background task by running:
        < $ bg %1 >

    Stop running the node process by running: 
        < $ killall -9 node >

    Install PM2 by running:
         <$ npm i -g pm2 >

    Ensure the PMz restarts with the server by running:
        < $ pm2 startup >

    Run the line of code that you are instructed to by a prompt in the terminal.

    Start server by running: 
        < $ pm2 start server/index.js >

    Save the code by running:
        < $ pm2 save >

5. Deploying Content
Create a new GitHub repository and a corresponding folder on the local machine.

  Create an index.js file in the repo with same basic server script in the index.js file in the server directory.

	Put the node_moduels and DS_Store files in the .gitignore file.

 Commit the repo and push it to GitHub by running:
    < $ git add . >
    < $ git commit -m 'first commit' >
    < $ git remote add origin  [git url] >
    < $ git push -u origin master >

SSH into the server and generate a key pair by running:
    < $ ssh-keygen -t rsa >

Find the key by running:
    < $ cat ~/.ssh/id_rsa.pub >

Copy the key contents and save them into Github by going to the repo, navigating to "Settings" > "Deploy Keys" > "Add Deploy Key" and pasting the key contents.

SSH into the server, open the ~./bashrc file add add the following lines to the top:
    # Start the SSH agent
    eval `ssh-agent -s`
    # Add the SSH key
    Ssh-add

Run the bashrc file by running:
    < $ source ~/.bashrc >


Clone the github to the server by running:
	< $ Git clone: [git url] >

Remove the code you pulled in from git into your server:
    < $ rm -rf ~/[repo name] >

In the local version of the project, install npm globally:
    < $ npm i -g pm2 >

The create a config file named ecosystem.config.js
    module.exports = {
    apps: [{
        name: 'aws-server',
        script: './index.js'
    }],
    deploy: {
        production: {
        user: 'ubuntu',
        host: [AWS Public DNS]',
        key: '[key-name.pem]',
        ref: 'origin/master',
        repo: '[git url'],
        path: '/home/ubuntu/[Git repo name]',
        'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
        }
    }
    }

Setup the directories on the remote by running: 
    < $ pm2 deploy ecosystem.config.js production setup >

Commit the changes

Run the deploy command:
    < $ pm2 deploy ecosystem.config.js production > 

Add the below deploy and restart script to package.json: 

	"restart": "pm2 startOrRestart ecosystem.config.js",
   "deploy": "pm2 deploy ecosystem.config.js production",

Install PM2 locally and save, using --save-dev: 
    < $ npm i pm2 --save-dev >

Commit changes  and deploy running: 
	< $ npm run-script deploy>

Make sure the app restarts with server running:
	< $ pm2 save >

To serve an HTML file, add a public directory

In the public directory, create an index.html file with the content you wish to run, and any .css style files or .js files you may need.
Commit the changes and push to GitHub.

Deploy the changes again running: 
    < $ npm run-script deploy>

The sever should be running and displaying your content.



