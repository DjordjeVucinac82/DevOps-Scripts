#!/bin/bash
# Install docker ubuntu
apt-get update
apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
apt-get update
apt-get install -y docker-ce
usermod -aG docker ubuntu

# Install docker-compose ubuntu
curl -L https://github.com/docker/compose/releases/download/1.21.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# READ MORE: https://docs.docker.com/install/linux/docker-ce/ubuntu/
# To check: grep "cloud-init\[" /var/log/syslog
#       OR: less /var/log/cloud-init-output.log

# Manually add user to docker group
# sudo usermod -aG docker $USER

---
# Docker on ec2 via User data Amazon Linux 2 AMI yum
#! /bin/sh
yum update -y
amazon-linux-extras install docker
service docker start
usermod -a -G docker ec2-user
chkconfig docker on
yum install -y git
curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

#27.01.2022 linux 2 AMI versions ref to above lines
#[ec2-user@ip-172-31-28-0 ~]$ docker -v
#Docker version 20.10.7, build f0df350
#[ec2-user@ip-172-31-28-0 ~]$ docker-compose version
#Docker Compose version v2.2.3
#[ec2-user@ip-172-31-28-0 ~]$ git --version
#git version 2.32.0

sudo yum -y install docker; \
sudo service docker start; \
sudo usermod -a -G docker ec2-user; \
sudo chkconfig docker on; \
sudo curl -L --fail https://raw.githubusercontent.com/linuxserver/docker-docker-compose/master/run.sh -o /usr/local/bin/docker-compose; \
sudo chmod +x /usr/local/bin/docker-compose; \
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose; \
sudo reboot;
