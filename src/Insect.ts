export class Insect extends Phaser.GameObjects.Sprite {
  speed: number;
  changeDirectionDelay: number;
  timeSinceLastDirectionChange: number;
  currentDirection: Phaser.Math.Vector2;
  target: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "insect", 0);
    scene.add.existing(this);

    this.speed = 30; // Adjust for desired speed
    this.changeDirectionDelay = 2000; // How often to change direction (in milliseconds)
    this.timeSinceLastDirectionChange = 0;
    this.currentDirection = new Phaser.Math.Vector2(0, 0); // Initialize with no movement

    this.setRandomDirection();
  }

  setRandomDirection() {
    // Get a random angle in radians
    const randomAngle = Phaser.Math.FloatBetween(0, 2 * Math.PI);

    // Convert the angle to a unit vector representing the direction
    this.currentDirection.setToPolar(randomAngle, 1);
  }

  setTarget(plant: Phaser.GameObjects.Image) {
    this.target = plant;
  }

  checkBounds() {
    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;

    if (this.x < halfWidth) {
      this.x = halfWidth;
      this.currentDirection.x *= -1; // Reverse horizontal direction
    } else if (this.x > this.scene.scale.width - halfWidth) {
      this.x = this.scene.scale.width - halfWidth;
      this.currentDirection.x *= -1;
    }

    if (this.y < halfHeight) {
      this.y = halfHeight;
      this.currentDirection.y *= -1; // Reverse vertical direction
    } else if (this.y > this.scene.scale.height - halfHeight) {
      this.y = this.scene.scale.height - halfHeight;
      this.currentDirection.y *= -1;
    }

    const targetBounds = this.target.getBounds();
    const isInsideTarget = targetBounds.contains(this.x, this.y);
    // if insect is outside of target bounds, setFrame to 1 (fly)
    // if insect is inside target bounds, setFrame to 0 (stay)
    this.setFrame(isInsideTarget ? 0 : 1);

    this.speed = isInsideTarget ? 30 : 70;
  }

  update(time: number, delta: number) {
    this.timeSinceLastDirectionChange += delta;

    if (this.timeSinceLastDirectionChange > this.changeDirectionDelay) {
      this.setRandomDirection();
      this.timeSinceLastDirectionChange = 0;
    }

    this.x += this.currentDirection.x * this.speed * (delta / 1000);
    this.y += this.currentDirection.y * this.speed * (delta / 1000);

    // Calculate the angle of the current direction
    const angleRadians = Math.atan2(
      this.currentDirection.y,
      this.currentDirection.x,
    );

    // Set the rotation of the sprite
    this.rotation = angleRadians + Math.PI / 2;

    // Optional: Add boundary collision to keep the bug within the game world
    this.checkBounds();
  }
}
