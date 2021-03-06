import Vue from "../../node_modules/vue/dist/vue.esm.js";
import { take, findIndex } from "lodash";
import { makeLogger } from "../lib/logging/Logger.js";
import ScoreStream from "../lib/server/ScoreStream.js";

const log = makeLogger("Approve");

// infer the correct host to connect to based on current hostname
let serverHost;
if (location.hostname.includes(".com")) {
  serverHost =
    "demo4-dashboard-service-demo4-dashboard.apps.summit-gce.sysdeseng.com";
} else if (location.hostname.includes("localhost")) {
  serverHost = "localhost:1234";
} else {
  serverHost = `${location.hostname}:1234`;
}

const app = new Vue({
  el: "#approve-app",
  data: {
    scoredImages: []
  },
  methods: {
    approve: function(event) {
      const i = event.target.dataset.index;
      const id = this.scoredImages[i].id;
      log(`approve ${i}`);
      fetch(`http://${serverHost}/images/approve/${id}`);
      this.removeImage(i);
    },
    reject: function(event) {
      const i = event.target.dataset.index;
      const id = this.scoredImages[i].id;
      log(`reject ${i}`);
      fetch(`http://${serverHost}/images/reject/${id}`);
      this.removeImage(i);
    },
    removeImage: function(i) {
      this.scoredImages.splice(i, 1);
    }
  }
});

// it's hacky time
window.app = app;

const scoreStream = new ScoreStream({ url: `ws://${serverHost}/images/all` });

scoreStream.addEventListener("open", () => log("stream open"));
scoreStream.addEventListener("message", msg => {
  if (!msg.data) {
    return;
  }

  let data;

  try {
    data = JSON.parse(msg.data);
  } catch (e) {
    console.error(`couldn't decode JSON:`);
    console.error(msg.data);
    return;
  }

  log(`received image: ${data.imageURL.slice(data.imageURL.length - 25)}`);

  // if there are empty spaces in the pending image array, inject there, otherwise push onto the end
  app.scoredImages.push(data);
});

let nextStormToggle = true;

// add storm button for one user only
if (location.search === "?controls") {
  document.querySelector("#controls").classList.remove("hidden");
  const stormBtn = document.querySelector("#storm");
  const stormDesc = document.querySelector("#storm-response");
  stormBtn.addEventListener("click", () => {
    const action = nextStormToggle ? "start" : "stop";
    fetch(`http://${serverHost}/storm/${action}`)
      .then(rsp => rsp.json())
      .then(json => (stormDesc.textContent = json.message));
    nextStormToggle = !nextStormToggle;
    return false;
  });
}
