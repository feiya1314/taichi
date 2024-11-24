import { _decorator, Color, Node, tween, Sprite } from 'cc';
const { ccclass, property } = _decorator;
import Obstacle from "./Obstacle";

@ccclass('Cross')
export class Cross extends Obstacle {
    @property(Node)
    private crossNode: Node = null;

    @property({ type: Number })
    private duration = 0;

    private optionalColors: Color[] = [];

    start() {
        // this.crossNode.runAction(cc.repeatForever(cc.rotateBy(this.duration, 360)));

        tween(this.crossNode)
            .by(this.duration, { angle: -360 })
            .repeatForever().start();
    }

    update(deltaTime: number) {

    }

    override setColors(primaryColor: Color, optionalColors: Color[], optionalCount: number): void {
        if (optionalCount > optionalColors.length) {
            optionalCount = optionalColors.length;
        }

        this.optionalColors = [];
        this.optionalColors[0] = primaryColor;
        while (this.optionalColors.length < optionalCount) {
            var color = optionalColors[Math.floor(Math.random() * optionalCount)];
            if (this.optionalColors.indexOf(color) == -1) {
                this.optionalColors[this.optionalColors.length] = color;
            }
        }

        for (var i = 0; i < this.crossNode.children.length; i++) {
            var sprite: Sprite = this.crossNode.children[i].getComponent(Sprite);
            sprite.color = this.optionalColors[i % this.optionalColors.length];
        }
    }
}


