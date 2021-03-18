import { sleep, group } from "k6";
import http from "k6/http";
import { Counter } from 'k6/metrics';
import { check } from 'k6';

let counterErrors = new Counter('COUNTerrors');

export let options = {
    //thresholds: {
    //   http_req_duration: ['p(95)<2140'],
    //    http_reqs: ["rate>134"]
    //},
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
