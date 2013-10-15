shepherd-event-server
=====================

Shepherd Event Server

# Setting up the dev box

You need:

  - ruby
  - bundler
  - vagrant

Install the berkshelf plugin:

```sh
vagrant plugin install vagrant-berkshelf
```

```sh
# start the box
vagrant up
```

```sh
# start the server
cd /shepherd
sudo node index.js
```

Port 80 from the vm is forwarded to 60001 on your local machine so you
can browse to: http://localhost:60001.

