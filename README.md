# rssgen

## What is this

Node CLI app to generate RSS files from crawling sites. And also serve them because my RSS reader extension doesn't accept loading files locally using file:// *for some goddang reason*.

I use it to generate manga updates feed (Bokuyaba and Yangaru). These free chapters disappear after a while you know? Gotta stay updated and read them while they're there.

## Now what

This thing's page-crawling process involves running a local Chrome installation using [puppeteer-core](https://github.com/puppeteer/puppeteer) so set the env variable and run it locally because it's pretty heavy. If I wasn't such a broke ass bih I would've ran it on a paid Heroku server but it is what it is, que sera sera.
