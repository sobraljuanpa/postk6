import { sleep, group } from "k6";
import http from "k6/http";
import { Counter } from 'k6/metrics';
import { check } from 'k6';

let counterErrors = new Counter('COUNTerrors');

export let options = {
    thresholds: {
      http_req_duration: ['p(95)<6560'],
       http_reqs: ["rate>158"]
    },
};

export default function() {

  let rand = Math.random().toString(36).substring(7);

  let itemCreate = http.post("http://localhost:3000/items", `{"name":"${rand}"}`, {
    headers: {
      "host": "localhost:3000",
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.5",
      "accept-encoding": "gzip, deflate",
      "content-type": "application/json",
      "origin": "http://localhost:3000",
      "connection": "keep-alive",
    },
  });

  check(itemCreate, {
    'Item added correctly': (r) => r.json("name") === rand,
  });
  
  let itemID = itemCreate.json("id");
  // Automatically added sleep
  sleep(1);
  
  let itemComplete = http.put(
    `http://localhost:3000/items/${itemID}`,
    `{"name":"${rand}","completed":true}`, {
      headers: {
        "host": "localhost:3000",
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.5",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json",
        "origin": "http://localhost:3000",
        "connection": "keep-alive",
      },
    });

  check(itemComplete, {
    'Item completed correctly': (r) => r.json("completed") === true,
  });

  // Automatically added sleep
  sleep(1);
  
  let itemDelete = http.del(
    `http://localhost:3000/items/${itemID}`, {
      headers: {
        "host": "localhost:3000",
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.5",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json",
        "origin": "http://localhost:3000",
        "connection": "keep-alive",
      },
    });

  check(itemDelete, {
    'Item deleted correctly': (r) => r.status === 200,
  });

  // Automatically added sleep
  sleep(1);

};

import { jUnit, textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export function handleSummary(data) {
    console.log('Preparing the end-of-test summary...');

    return {
        'stdout': textSummary(data, { indent: ' ', enableColors: true}), // Show the text summary to stdout...
        'junit.xml': jUnit(data), // but also transform it and save it as a JUnit XML...
        'summary.json': JSON.stringify(data), // and a JSON with all the details...
        // And any other JS transformation of the data you can think of,
        // you can write your own JS helpers to transform the summary data however you like!
    }
}
