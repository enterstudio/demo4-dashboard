import * as THREE from "three";
import ScoredImageSource from "./ScoredImageSource.js";
import ParticleImageFactory from "./ParticleImageFactory.js";
import MovingParticleFactory from "./MovingParticleFactory.js";
import TrainingSimulation from "./TrainingSimulation.js";
import { makeLogger } from "../logging/Logger.js";

const log = makeLogger("Stage");

export default class Stage {
  constructor({ container = document.body, data = {} } = {}) {
    log("created");
    this.actors = [];
    this.container = container;
    this.imageCount = 0;

    this._init();

    // start the animation loop
    this._render();
  }
  hideUI() {
    document.body.classList.add("training");
  }
  startTraining() {
    setTimeout(() => TrainingSimulation.start(this, 0), 0);
    setTimeout(() => TrainingSimulation.start(this, 1), 7000);
    setTimeout(() => TrainingSimulation.start(this, 2), 14000);
    setTimeout(() => TrainingSimulation.start(this, 3), 21000);
  }
  _init() {
    this._initScene();
    this._initRenderer();
    this._initCamera();
    this._initImageSource();
  }
  _initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }
  _initImageSource() {
    this._initScoredImageSource();
  }
  _initScoredImageSource() {
    this.imageSource = new ScoredImageSource();
    this.imageSource.onImage((scoredImage, imgEl) => {
      log(`scored image is on stage!`);

      this.imageCount++;

      if (window.leaderboard) {
        const imgModel = { src: imgEl.src, id: this.imageCount };
        leaderboard.scoredImages.push(imgModel);
        setTimeout(() => {
          const i = leaderboard.scoredImages.indexOf(imgModel);
          console.log(`removing ${i}`, imgModel);
          leaderboard.scoredImages.splice(i, 1);
        }, 4000);
      }

      // const particleImage = ParticleImageFactory.create(
      //   this,
      //   scoredImage.pixels
      // );
      // this._registerActor(particleImage);

      const taskNames = {
        // adventure mode
        "Find Burr": 0,
        "Find a teddy bear": 1,
        "Find a horse": 2,
        "Find an apple": 3,

        "Find a car": 4,
        "Find a laptop": 5,
        "Find an umbrella": 6,
        "Find a person": 7,
        "Find a bus": 4,
        "Find a cell phone": 6,
        "Find a giraffe": 7
      };

      this._initMovingParticles(taskNames[scoredImage.taskName]);
    });
  }
  _initMovingParticles(path = 0) {
    const mp = MovingParticleFactory.create(this, null, path);
    this._registerActor(mp);
    mp.onComplete(mp => this._unregisterActor(mp));
  }
  _registerActor(actor) {
    log(`adding actor ${actor.name} to the stage`);
    console.log(actor);
    this.actors.push(actor);
  }
  _unregisterActor(actor) {
    log(`removing actor ${actor.name} from the stage`);
    this.actors.splice(this.actors.indexOf(actor), 1);
    actor.destroy();
  }
  _initCamera() {
    // this._initOrthographicCamera();
    this._initPerspectiveCamera();
  }
  _initPerspectiveCamera() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    log(`res: ${w} x ${h}`);
    this.camera = new THREE.PerspectiveCamera(70, w / h, 1, 3000);
    this.camera.position.z = 100;
  }
  _initOrthographicCamera() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    const f = 1000;

    this.camera = new THREE.OrthographicCamera(
      w / -2,
      w / 2,
      h / 2,
      h / -2,
      1,
      f
    );
    this.camera.position.z = 400;
  }
  _initScene() {
    this.scene = new THREE.Scene();
  }
  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0, 0);
    this.container.appendChild(this.renderer.domElement);
  }
  _update() {
    this.actors.forEach(actor => actor.update(this));
  }
  _render() {
    requestAnimationFrame(() => this._render());
    this._update();
    this.renderer.render(this.scene, this.camera);
  }
}
