export class Plant extends Phaser.GameObjects.Image {
  private _hp: number;
  private _maxHp: number;

  constructor(scene: Phaser.Scene, x: number, y: number, initialHp: number) {
    super(scene, x, y, "plant");
    scene.add.existing(this);
    this._maxHp = 100;
    this._hp = initialHp;

    const renderer = this.scene.game
      .renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    renderer.pipelines.add("sway", new SwayPipeline(this.scene.game));
    renderer.pipelines.get("sway").set1f("strength", 1.0);
    this.setPipeline("sway");
  }

  get hp() {
    return this._hp;
  }

  increaseHp(amount: number) {
    this._hp = Math.min(this._maxHp, this._hp + amount);
  }

  decreaseHp(amount: number) {
    this._hp = Math.max(0, this._hp - amount);
  }

  setSwayStrength(strength: number) {
    const renderer = this.scene.game
      .renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    const pipeline = renderer.pipelines.get("sway") as SwayPipeline;
    console.log("set sway strength", strength);
    if (pipeline) {
      pipeline.set1f("strength", strength);
    }
  }
}

class SwayPipeline extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
  constructor(game: Phaser.Game) {
    super({
      game,
      // vertShader: SwayPipeline.vertexShader,
      fragShader: SwayPipeline.fragmentShader,
    });
  }

  onPreRender() {
    this.set1f("time", this.game.loop.time / 1000);
    // this.set1f("strength", 1.0);
  }

  static fragmentShader = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform float time;
    uniform sampler2D uMainSampler;
    uniform float strength;
    varying vec2 outTexCoord;

    void main() {
        vec2 uv = outTexCoord;
        
        // Horizontal sway: stronger near top
        float topSwayStrength = (1.0 - uv.y) * strength;
        float waveX = sin((uv.y + time * 0.8) * 5.0) * 0.01;
        uv.x += waveX * topSwayStrength;

        // Vertical sway: stronger near sides
        float sideSwayStrength = abs(uv.x - 0.5) * strength;
        float waveY = sin((uv.x + time * 0.5) * 10.0) * 0.01;
        uv.y += waveY * sideSwayStrength;

        gl_FragColor = texture2D(uMainSampler, uv);
    }
  `;
}
