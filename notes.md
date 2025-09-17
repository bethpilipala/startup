# CS 260 Notes

[My startup - The Partial Pantry](http://54.209.61.50)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## SSHing in

In the command prompt, type: ssh -i prod-ec2-key.pem ubuntu@54.209.61.50

Make sure it is in the folder where the .pem file exists

## AWS

My IP address is: 54.209.61.50

My domain name is: thepartialpantry.click

I've already had an AWS account and so my free tier has expired. I thought about just turning off my server when I don't need it, but the t2.nano EC2 instance costs about the same as the elastic ip address when not connecting to an instance. However, in the case that I move up to a t2.micro instance or above, I automated a startup/shutdown process for my EC2 instance using Amazon EventBridge and AWS Lambda.

#TODO: include what I did and how I did it

This means that when I have it enabled, my website will be unreachable during the hours of _____. But it will be cheaper for me.
In the future I could change this by completely restructuring how things work and use other Amazon services like Amplify Hosting, AWS Lambda, DynamoDB and Amazon Cognito (this will probably be after this class is ended).

## Caddy

## HTML

## CSS

## React Part 1: Routing

## React Part 2: Reactivity