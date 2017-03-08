# Data-summarization
Extract, summarize and index data.

Node js is required to run this script from the commandline, which can be downloaded for windows here https://nodejs.org/en/download/. After placing the files into a single folder e.g. "Data summarization", navigate to the folder path through the commandline and type "node JmeterDataSummary.js".
To configure this script to better suit your needs, open the "config.js" file in an IDE of your choice and alter the contents of the module.exports object. Should the config file not contain any reference to an element of the script that you wish to alter, then you will need to change that module directly. For instance, if you need to change the fields being extracted from the response, you will need to open the "resultHandling.js" file and alter the data being pushed to the array.

# Command-line / terminal instructions

0. ```git clone https://github.com/FallenMan13/Data-summarization.git```
0. ```cd Data-summarization```
0. ```npm install```
0. ```node JmeterDataSummary```
