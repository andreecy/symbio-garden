const spriteFrame = {
  100: 0, // 75-100%
  75: 1, // 50-75%
  50: 2, // 25-50%
  25: 3, // 0-25%
  0: 4, // 0%
};

export class Plant extends Phaser.GameObjects.Image {
  private _hp: number;
  private _maxHp: number;

  constructor(scene: Phaser.Scene, x: number, y: number, initialHp: number) {
    super(scene, x, y, "plant");
    scene.add.existing(this);
    this._maxHp = 100;
    this._hp = initialHp;
    this.setFrameByHp(this._hp);

    const renderer = this.scene.game
      .renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    renderer.pipelines.add("sway", new SwayPipeline(this.scene.game));
    renderer.pipelines.get("sway").set1f("strength", 1.0);
    renderer.pipelines
      .get("sway")
      .set4f(
        "frameUV",
        this.frameUV.x,
        this.frameUV.y,
        this.frameUV.w,
        this.frameUV.h
      );
    this.setPipeline("sway");
  }

  get frameUV() {
    const frame = this.frame;
    const baseTexWidth = frame.texture.source[0].width;
    const baseTexHeight = frame.texture.source[0].height;

    return {
      x: frame.cutX / baseTexWidth,
      y: frame.cutY / baseTexHeight,
      w: frame.cutWidth / baseTexWidth,
      h: frame.cutHeight / baseTexHeight,
    };
  }

  get hp() {
    return this._hp;
  }

  increaseHp(amount: number) {
    this._hp = Math.min(this._maxHp, this._hp + amount);
    this.setFrameByHp(this._hp);
  }

  decreaseHp(amount: number) {
    this._hp = Math.max(0, this._hp - amount);
    this.setFrameByHp(this._hp);
  }

  setHp(hp: number) {
    this._hp = Math.max(0, Math.min(this._maxHp, hp));
    this.setFrameByHp(this._hp);
  }

  setFrameByHp(hp: number) {
    if (hp > this._maxHp) {
      hp = this._maxHp;
    }
    if (hp <= 100) {
      this.setFrame(spriteFrame[100]);
    }
    if (hp <= 75) {
      this.setFrame(spriteFrame[75]);
    }
    if (hp <= 50) {
      this.setFrame(spriteFrame[50]);
    }
    if (hp <= 25) {
      this.setFrame(spriteFrame[25]);
    }
    if (hp <= 0) {
      this.setFrame(spriteFrame[0]);
    }
  }

  setFrame(
    frame: string | number | Phaser.Textures.Frame,
    updateSize?: boolean,
    updateOrigin?: boolean
  ): this {
    super.setFrame(frame, updateSize, updateOrigin);
    const renderer = this.scene.game
      .renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    const pipeline = renderer.pipelines.get("sway") as SwayPipeline;
    if (pipeline) {
      pipeline.set4f(
        "frameUV",
        this.frameUV.x,
        this.frameUV.y,
        this.frameUV.w,
        this.frameUV.h
      );
    }
    return this;
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
    uniform vec4 frameUV;
    varying vec2 outTexCoord;

    void main() {
        // Normalize UV within current frame
        vec2 uv = outTexCoord;
        vec2 framePos = frameUV.xy;
        vec2 frameSize = frameUV.zw;
        vec2 localUV = (uv - framePos) / frameSize;
        
        // Horizontal sway: stronger near top
        float topSwayStrength = (1.0 - localUV.y) * strength;
        float waveX = sin((uv.y + time * 0.5) * 5.0) * 0.01;
        localUV.x += waveX * topSwayStrength;

        // Vertical sway: stronger near sides
        float sideSwayStrength = abs(localUV.x - 0.5) * strength;
        float waveY = sin((uv.x + time * 0.5) * 10.0) * 0.01;
        localUV.y += waveY * sideSwayStrength;

        // Convert back to full texture UV
        uv = framePos + localUV * frameSize;

        gl_FragColor = texture2D(uMainSampler, uv);
    }
  `;
}
