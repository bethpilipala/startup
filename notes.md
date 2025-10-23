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

---


### Midterm Study Guide

---

### 1. In the following code, what does the `<link>` element do?

It links external resources to an HTML document — most often an external CSS stylesheet.

Example:

```html
<link rel="stylesheet" href="styles.css">
```

This tells the browser to load and apply the styles from `styles.css`.

---

### 2. In the following code, what does a `<div>` tag do?

It defines a division or section in an HTML document. It’s a block-level container used to group elements for styling or scripting.

---

### 3. In the following code, what is the difference between the `#title` and `.grid` selector?

* `#title` selects an element with the **id** `title`.
* `.grid` selects **all elements** with the **class** `grid`.

---

### 4. In the following code, what is the difference between `padding` and `margin`?

* **Padding**: Space **inside** the element’s border (between content and border).
* **Margin**: Space **outside** the border (between the element and others).

---

### 5. Given this HTML and CSS, how will the images be displayed using flex?

Images inside a flex container will align according to the container’s flex properties — for example:

* `display: flex;` makes them align in a row by default.
* `justify-content` controls horizontal spacing.
* `align-items` controls vertical alignment.

---

### 6. What does the following padding CSS do?

```css
padding: 10px 20px;
```

Adds:

* 10px padding **top and bottom**
* 20px padding **left and right**

---

### 7. What does the following code using arrow syntax function declaration do?

```js
const add = (a, b) => a + b;
```

Defines a function that takes two arguments `a` and `b`, and returns their sum.

---

### 8. What does the following code using `map` with an array output?

```js
const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);
console.log(doubled);
```

Output:

```
[2, 4, 6]
```

---

### 9. What does the following code output using `getElementById` and `addEventListener`?

```js
document.getElementById("btn").addEventListener("click", () => {
  console.log("Clicked!");
});
```

When the element with id `"btn"` is clicked, it logs `"Clicked!"` to the console.

---

### 10. What does the following line of JavaScript do using a `#` selector?

```js
document.querySelector("#title");
```

Selects the first element in the document with the id `title`.

---

### 11. Which of the following are true? (Mark all that are true about the DOM)

* The DOM represents the structure of an HTML document as a tree.
* JavaScript can modify elements in the DOM.
* The DOM updates dynamically as the page changes.

---

### 12. By default, the HTML `<span>` element has a default CSS `display` property value of:

`inline`

---

### 13. How would you use CSS to change all the `div` elements to have a background color of red?

```css
div {
  background-color: red;
}
```

---

### 14. How would you display an image with a hyperlink in HTML?

```html
<a href="https://example.com">
  <img src="image.jpg" alt="Example">
</a>
```

---

### 15. In the CSS box model, what is the ordering of the box layers starting at the inside and working out?

**Content → Padding → Border → Margin**

---

### 16. Given the following HTML, what CSS would you use to set the text "trouble" to green and leave the "double" text unaffected?

HTML:

```html
<p>double <span id="trouble">trouble</span></p>
```

CSS:

```css
#trouble {
  color: green;
}
```

---

### 17. What will the following code output when executed using a for loop and console.log?

```js
for (let i = 0; i < 3; i++) {
  console.log(i);
}
```

Output:

```
0
1
2
```

---

### 18. How would you use JavaScript to select an element with the id of “byu” and change the text color of that element to green?

```js
document.getElementById("byu").style.color = "green";
```

---

### 19. What is the opening HTML tag for:

* Paragraph → `<p>`
* Ordered list → `<ol>`
* Unordered list → `<ul>`
* Second level heading → `<h2>`
* First level heading → `<h1>`
* Third level heading → `<h3>`

---

### 20. How do you declare the document type to be HTML?

```html
<!DOCTYPE html>
```

---

### 21. What is valid JavaScript syntax for `if`, `else`, `for`, `while`, `switch` statements?

**if / else**

```js
if (x > 0) {
  console.log("Positive");
} else {
  console.log("Non-positive");
}
```

**for**

```js
for (let i = 0; i < 5; i++) { ... }
```

**while**

```js
while (condition) { ... }
```

**switch**

```js
switch(value) {
  case 1: ...; break;
  default: ...;
}
```

---

### 22. What is the correct syntax for creating a JavaScript object?

```js
const person = {
  name: "Alice",
  age: 25
};
```

---

### 23. Is it possible to add new properties to JavaScript objects?

✅ Yes, for example:

```js
person.city = "Provo";
```

---

### 24. If you want to include JavaScript on an HTML page, which tag do you use?

```html
<script src="script.js"></script>
```

---

### 25. Given the following HTML, what JavaScript could you use to set the text "animal" to "crow" and leave the "fish" text unaffected?

HTML:

```html
<p id="animal">fish</p>
```

JavaScript:

```js
document.getElementById("animal").textContent = "crow";
```

---

### 26. Which of the following correctly describes JSON?

JSON (JavaScript Object Notation) is a **lightweight data-interchange format** that uses **key-value pairs** and arrays, similar to JavaScript objects.

Example:

```json
{
  "name": "Alice",
  "age": 25
}
```

---

### 27. What does the console command `chmod`, `pwd`, `cd`, `ls`, `vim`, `nano`, `mkdir`, `mv`, `rm`, `man`, `ssh`, `ps`, `wget`, `sudo` do?

| Command | Description                        |
| ------- | ---------------------------------- |
| `chmod` | Change file permissions            |
| `pwd`   | Print working directory            |
| `cd`    | Change directory                   |
| `ls`    | List directory contents            |
| `vim`   | Open file in Vim editor            |
| `nano`  | Open file in Nano editor           |
| `mkdir` | Create a new directory             |
| `mv`    | Move or rename files               |
| `rm`    | Remove files or directories        |
| `man`   | Display manual pages               |
| `ssh`   | Connect to remote machine securely |
| `ps`    | Show active processes              |
| `wget`  | Download files from the web        |
| `sudo`  | Execute command as superuser       |

---

### 28. Which of the following console commands creates a remote shell session?

`ssh`

---

### 29. Which of the following is true when the `-la` parameter is specified for the `ls` console command?

It lists **all files**, including hidden ones (`-a`), in **long format** (`-l`).

---

### 30. Which of the following is true for the domain name `banana.fruit.bozo.click`?

* **Top-level domain (TLD):** `click`
* **Root domain:** `bozo.click`
* **Subdomain:** `banana.fruit`

---

### 31. Is a web certificate necessary to use HTTPS?

Yes. HTTPS requires a valid SSL/TLS certificate.

---

### 32. Can a DNS A record point to an IP address or another A record?

No. A DNS A record points **only to an IP address**, not to another A record.

---

### 33. Port 443, 80, 22 is reserved for which protocol?

| Port | Protocol |
| ---- | -------- |
| 443  | HTTPS    |
| 80   | HTTP     |
| 22   | SSH      |

---

### 34. What will the following code using Promises output when executed?

```js
new Promise(resolve => resolve("done")).then(console.log);
```

Output:

```
done
```

---
