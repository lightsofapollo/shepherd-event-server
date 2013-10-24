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

# Environment Variables
These MUST be set on the server which this runs.

- BUGZILLA_URL: used for all bugzilla commands.
- BUGZILLA_USERNAME: used for all bugzilla commands.
- BUGZILLA_PASSWORD: used for all bugzilla commands.
- GITHUB_TOKEN: github oauth token used in all github commands.
