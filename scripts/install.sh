#!/bin/sh
cd /home/pi/Desktop

# test if the internet is connected
is_online=false
is_already_installed=false


# testing if there is internet
wget -q --spider http://google.com
if [ $? -eq 0 ]; then
    echo "is online"
    is_online=true
fi

# test if already installed
FILE=/home/pi/Desktop/is_installed
if [ -f "$FILE" ]; then
    echo "is installed"
    is_already_installed=true
fi


# install node
sudo apt install nodejs -y

# run the configure script
node configure.js

# if not already installed, then get the repo and run the install script
if [ "$is_already_installed" = false ] ; then
    pip3 install pygame # pygame is used for audio playback
    git clone https://github.com/timo-quinn/avian-rpi.git
    cd /home/pi/Desktop/avian-rpi/
    # make all the files executable
    chmod -R +x .
    # purge crontab
    crontab -r
    # set up the cron job to run this configure script every 2 minutes
    (crontab -l 2>/dev/null; echo "*/2 * * * * sh /home/pi/Desktop/avian-rpi/configure.sh") | crontab -

    sudo /bin/cp -f rc.local /etc/rc.local

    /bin/cp -f /home/pi/Desktop/avian-rpi/default_state.json /home/pi/Desktop/state.json

    # two beeps to mark that it's configured
    python3 play_beep.py
    python3 play_beep.py

    # create the is_installed folder to make sure this only runs once
    cd /home/pi/Desktop/
    touch is_installed
else # pull down the latest configuration
    cd /home/pi/Desktop/avian-rpi

    git stash # stash changes to make sure they don't interfere with the updates
    git pull # pull the latest master branch
    python3 play_beep.py # one beep to mark it's been updated
    python3 play_sample.py # play the sample
    sudo /bin/cp -f rc.local /etc/rc.local # update the boot scripts
fi

exit 0

