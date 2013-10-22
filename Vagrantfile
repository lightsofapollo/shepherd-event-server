# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.define "bugzilla" do |config|
    config.vm.hostname = "bz-bugzilla-test"

    # Every Vagrant virtual environment requires a box to build off of.
    config.vm.box = "bugzilla-oct21"
    config.vm.box_url = "https://dl.dropboxusercontent.com/u/26058666/bugzilla.box"
    config.vm.network :private_network, ip: "33.33.33.10"
    config.vm.network "forwarded_port", guest: 80, host: 8080
  end

  config.vm.define "node" do |config|
    config.vm.hostname = "shepherd-event-server-berkshelf"

    config.vm.box = "Berkshelf-CentOS-6.3-x86_64-minimal"
    config.vm.box_url = "https://dl.dropbox.com/u/31081437/Berkshelf-CentOS-6.3-x86_64-minimal.box"

    config.vm.network :private_network, ip: "33.33.33.10"

    config.vm.network "forwarded_port", guest: 60001, host: 60001
    config.vm.network "forwarded_port", guest: 27017, host: 27017

    # allow symlinks in shared folders
    config.vm.provider "virtualbox" do |v|
      v.customize [
        "setextradata",
        :id,
        "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root",
        "1"
      ]
    end

    # The path to the Berksfile to use with Vagrant Berkshelf
    config.berkshelf.berksfile_path = "./Berksfile"

    # Enabling the Berkshelf plugin. To enable this globally, add this configuration
    # option to your ~/.vagrant.d/Vagrantfile file
    config.berkshelf.enabled = true

    config.vm.provision :chef_solo do |chef|
      chef.json = {
        :mongodb => {},
        :nodejs => {
          :install_method => 'package',
          :version => '0.10.20'
        }
      }

      # FTR- this is not a great way to use chef but I am not 100% sold on us
      # managing this stuff ourselves anyway... For now we get a single dev box
      # that works.
      chef.run_list = [
        # so we can install mongo
        "recipe[mongodb::10gen_repo]",
        # configure it
        "recipe[mongodb::default]",
        "recipe[nodejs]",
        "recipe[git]",
      ]
    end
  end
end
