# CS 260 Notes

[My startup - The Partial Pantry](https://thepartialpantry.click)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## SSHing in

In the command prompt, type: **ssh -i prod-ec2-key.pem ubuntu@54.209.61.50**

* Make sure it is in the folder where the .pem file exists

## AWS

My IP address is: **54.209.61.50**

My domain name is: [thepartialpantry.click](http://thepartialpantry.click)

I've already had an AWS account and so my free tier has expired. I thought about just turning off my server when I don't need it, but the t2.nano EC2 instance costs about the same as the elastic ip address when not connecting to an instance. However, in the case that I move up to a t2.micro instance or above, I automated a startup/shutdown process for my EC2 instance using Amazon EventBridge and AWS Lambda.

* First I created an **IAM Role** for Lambda
  * Attached the policy AmazonEC2FullAccess
  * Named it EC2SchedulerRole
* Then in **Lambda** I created two functions
  * They are called StopFunction (to stop the instance) and StartFunction (to start it again)
  * Added an environment variable called INSTANCE_ID to each function that contains the EC2 instance id (i-xxxxxxxx)
    * **Important:** if the EC2 instance is changed (destroyed and then spun up), I will have to manually go in and change the environment variables to match the new EC2 instance id
  * Attached the EC2SchedulerRole IAM Role
* Schedule Events with **EventBridge**
  * Created 2 events, StopEC2Nightly and StartEC2Daily
  * Calls the Lambda functions I created
  * Stops at 12am MDT and starts at 7am MDT

To enable it, go into EventBridge and enable the two events.

This means that when I have it enabled, my website will be unreachable during the hours of 12-7am. But it will be cheaper for me.
In the future I could change this by completely restructuring how things work and use other Amazon services like Amplify Hosting, AWS Lambda, DynamoDB and Amazon Cognito (this will probably be after this class is ended).

Try this: CloudWatch Alarms (e.g., low CPU usage for N minutes) to trigger a stop function dynamically instead of fixed times.

## Caddy

I just followed the directions [here](https://github.com/webprogramming260/.github/blob/main/profile/webServers/https/https.md) and now my website is secure!

## HTML

## CSS

## React Part 1: Routing

## React Part 2: Reactivity


## General Notes
