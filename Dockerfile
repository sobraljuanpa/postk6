FROM jenkins/jenkins:lts

USER root
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 379CE192D401AB61
RUN echo "deb https://dl.bintray.com/loadimpact/deb stable main" >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y k6 nodejs
RUN npm install -g yarn
RUN jenkins-plugin-cli --plugins performance:3.19
USER jenkins