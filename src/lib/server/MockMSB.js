/////////////////////////////////////////////////
//  A fake Microservice B to use on the plane  //
/////////////////////////////////////////////////

const Hapi = require("hapi");
const _ = require("lodash");
const hapiWebSocket = require("hapi-plugin-websocket");
const WebSocket = require("ws");
const fetch64 = require("fetch-base64");
const nanoid = require("nanoid");

const server = Hapi.server({
  port: 1235,
  routes: {
    cors: true
  }
});

server.route({
  method: "POST",
  path: "/dashboard",
  config: {
    plugins: {
      websocket: {
        only: true,
        autoping: 30 * 1000,
        connect: ({ ctx, wss, ws, req, peers }) => {
          console.log(`[MockMSB] dashboard client connected`);

          // send a single fabricated message after a short wait
          setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              const taskNames = [
                "Burr",
                "a teddy bear",
                "a horse",
                "an apple",

                "a car",
                "a laptop",
                "an umbrella",
                "a person",
                "a bus",
                "a cell phone",
                "a giraffe"
              ];

              const data = {
                imageURL:
                  "https://palebluepixel.org/2017/03/10/meet-simpixel/maniacal.jpg",
                score: 5,
                id: nanoid(),
                taskName: _.sample(taskNames)
                /*
                image: `data:image/jpeg;base64,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`
                */
              };
              ws.send(JSON.stringify(data));
            }
          }, 1000);
        },
        disconnect: ({ ctx, ws }) => {
          console.log(`[MockMSB] client disconnected`);
        }
      }
    }
  },
  handler: (request, h) => {
    return "";
  }
});

const init = async () => {
  await server.register(hapiWebSocket);
  await server.start();
  console.log(`[MockMSB] running at: ${server.info.uri}`);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
