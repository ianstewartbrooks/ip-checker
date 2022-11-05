# ip-checker

A docker container that contains a small node appliction which monitors any changes in the IP my ISP allocates me.

The application informs me, via a Pushover notification, whenever it detects my IP has changed.

To use this application you need an Application Token and a User Key from your Pushover account which then can be put in the environment variables for the application to use. The two relevant variables are `PUToken` and `PUUserKey`, which in my case, are passed in via Portainer that then builds and runs the contaienr for me on my NAS.
