import * as THREE from "three";
import MovingParticles from "./MovingParticles.js";
import { makeLogger } from "../logging/Logger";

const log = makeLogger("TrainingSimulation");

export default class TrainingSimulation {
  static start(stage, i) {
    log("creating a moving particle object");

    // coordinates are: [ x1, y1, x2, y2, x3, y3, ..., xN, yN ]
    const paths = {
      nodes: 17,
      components: 2,
      count: 8,
      coordinates: [
        500,
        580,
        640,
        580,
        770,
        580,
        770,
        480,
        930,
        480,
        930,
        580,
        1070,
        580,
        1220,
        580,
        1410,
        580,
        1620,
        580,
        1620,
        410,
        1620,
        270,
        1770,
        270,
        1910,
        270,
        2070,
        270,
        2220,
        270,
        2220,
        270,
        500,
        580,
        640,
        580,
        770,
        580,
        770,
        480,
        930,
        480,
        930,
        580,
        1150,
        580,
        1150,
        460,
        1150,
        380,
        1290,
        380,
        1420,
        380,
        1560,
        380,
        1700,
        380,
        1840,
        380,
        1970,
        380,
        2080,
        380,
        2180,
        380,
        500,
        580,
        640,
        580,
        770,
        580,
        770,
        480,
        930,
        480,
        1080,
        480,
        1230,
        480,
        1390,
        480,
        1550,
        480,
        1730,
        480,
        1920,
        480,
        2090,
        480,
        2220,
        480,
        2220,
        480,
        2220,
        480,
        2220,
        480,
        2220,
        480,
        500,
        580,
        640,
        580,
        770,
        580,
        770,
        480,
        930,
        480,
        930,
        580,
        1070,
        580,
        1220,
        580,
        1410,
        580,
        1620,
        580,
        1620,
        690,
        1730,
        690,
        1730,
        580,
        1870,
        580,
        2040,
        580,
        2250,
        580,
        2250,
        580,
        500,
        580,
        640,
        580,
        770,
        580,
        770,
        480,
        930,
        480,
        930,
        580,
        1070,
        580,
        1220,
        580,
        1410,
        580,
        1620,
        580,
        1620,
        690,
        1770,
        690,
        1930,
        690,
        2090,
        690,
        2230,
        690,
        2230,
        690,
        2230,
        690,
        500,
        580,
        640,
        580,
        770,
        580,
        770,
        690,
        920,
        690,
        1080,
        690,
        1260,
        690,
        1420,
        690,
        1420,
        800,
        1590,
        800,
        1760,
        800,
        1920,
        800,
        2060,
        800,
        2180,
        800,
        2180,
        800,
        2180,
        800,
        2180,
        800,
        500,
        580,
        640,
        580,
        770,
        580,
        770,
        690,
        960,
        690,
        970,
        800,
        1200,
        790,
        1200,
        900,
        1370,
        900,
        1550,
        900,
        1720,
        900,
        1890,
        900,
        2100,
        900,
        2280,
        900,
        2280,
        900,
        2280,
        900,
        2280,
        900,
        500,
        580,
        640,
        580,
        770,
        580,
        770,
        690,
        960,
        690,
        970,
        800,
        1200,
        790,
        1370,
        790,
        1520,
        790,
        1520,
        900,
        1520,
        1010,
        1690,
        1010,
        1870,
        1010,
        2040,
        1010,
        2190,
        1010,
        2190,
        1010,
        2190,
        1010
      ]
    };

    // const color = new THREE.Color(Math.random(), Math.random(), Math.random());
    const color = new THREE.Color(1, 1, 0);

    const distributions = [
      [1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8],
      [2 / 16, 2 / 16, 0 / 16, 4 / 16, 4 / 16, 0 / 16, 2 / 16, 2 / 16],
      [0 / 16, 1 / 16, 0 / 16, 5 / 16, 9 / 16, 0 / 16, 0 / 16, 1 / 16],
      [0 / 16, 0 / 16, 0 / 16, 0 / 16, 16 / 16, 0 / 16, 0 / 16, 0 / 16]
    ];

    const mp = new MovingParticles({
      stage,
      paths,
      probability: distributions[i],
      color,
      speed: 0.0035,
      pointCount: 3000,
      pointSize: 7,
      image: undefined
    });
    stage._registerActor(mp);
    mp.onComplete(mp => stage._unregisterActor(mp));

    return new Promise((resolve, reject) => {
      mp.onComplete(resolve);
    });
  }
}
