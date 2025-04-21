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
  }

  static fragmentShader = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform float time;
    uniform sampler2D uMainSampler;
    varying vec2 outTexCoord;

    void main() {
        vec2 uv = outTexCoord;
        
        // Intensity grows from bottom (0.0) to top (1.0)
        float swayStrength = 1.0 - uv.y;

        // Sway movement
        float wave = sin((pow(uv.y, 0.2) + time * 0.5) * 10.0) * 0.01;

        // Only apply sway more at top
        uv.x += wave * swayStrength;

        gl_FragColor = texture2D(uMainSampler, uv);
    }
  `;
}
