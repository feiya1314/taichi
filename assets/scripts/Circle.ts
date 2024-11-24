import { _decorator, Sprite, Color, Node, tween, log } from 'cc';
const { ccclass, property } = _decorator;
import Obstacle from "./Obstacle";

@ccclass('Circle')
export class Circle extends Obstacle {
    @property(Node)
    private starNode: Node = null;

    @property({ type: Number })
    private duration = 0;

    @property({ type: Boolean })
    private reverse = false;

    private optionalColors: Color[] = [];

    ouLoad(): void {

    }

    override setColors(primaryColor: Color, optionalColors: Color[], optionalCount: number): void {
        // log("circle optionalColors setColors:" + optionalColors.toString());
        // log("circle primaryColor setColors:" + primaryColor.toString());
        // log("circle optionalCount optionalCount:" + optionalCount);
        if (optionalCount > optionalColors.length) {
            optionalCount = optionalColors.length;
        }

        if (optionalColors.length == optionalCount && optionalColors.indexOf(primaryColor) > -1) {
            this.optionalColors = optionalColors;
        } else {
            this.optionalColors = [];
            this.optionalColors[0] = primaryColor;
            while (this.optionalColors.length < optionalCount) {
                var color = optionalColors[Math.floor(Math.random() * optionalCount)];
                if (this.optionalColors.indexOf(color) == -1) {
                    this.optionalColors[this.optionalColors.length] = color;
                }
            }
        }

        for (var i = 0; i < this.node.children.length; i++) {
            if (this.node.children[i] == this.starNode) {
                continue;
            }

            var nodeIndex = this.reverse ? (i % 2 == 0 ? i + 1 : i - 1) : i;
            var sprite: Sprite = this.node.children[nodeIndex].getComponent(Sprite);
            sprite.color = this.optionalColors[i % this.optionalColors.length];
        }

    }

    public hideStar(): void {
        this.starNode.active = false;
    }

    start() {
        log("circle start:" + this.duration);
        var angle = this.reverse ? -360 : 360;
        log("circle duration:" + this.duration);
        tween(this.node)
            .by(this.duration, { angle: angle })
            .repeatForever().start();

        tween(this.starNode)
            .by(this.duration, { angle: -angle })
            .repeatForever().start();

    }

    update(deltaTime: number) {

    }
}


