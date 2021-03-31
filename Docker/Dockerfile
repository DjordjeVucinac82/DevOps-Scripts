FROM phusion/passenger-nodejs:latest

# default if not specify
ARG nginx_conf=webapp.conf 

ENV HOME /root

EXPOSE 80
EXPOSE 443

CMD ["/sbin/my_init"]

RUN rm /etc/nginx/sites-enabled/default
ADD ${nginx_conf} /etc/nginx/sites-enabled/${nginx_conf}

RUN mkdir /home/app/webapp
WORKDIR /home/app/webapp
RUN mkdir public
COPY . /home/app/webapp

COPY package*.json .

RUN npm install
RUN npm run build

RUN chown -R app:app /home/app/webapp
RUN rm -f /etc/service/nginx/down

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*