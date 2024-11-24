import { _decorator, Color, Node } from 'cc';
const { ccclass, property } = _decorator;
import Obstacle from "./Obstacle";
import { Circle } from "./Circle";

@ccclass('DoubleCircle')
export class DoubleCircle extends Obstacle {
    @property(Node)
    private starNode: Node = null;

    private optionalColors: Color[] = [];

    start() {

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

        for (var child of this.node.children) {
            if (child == this.starNode) {
                continue;
            }
            var childO = child.getComponent(Circle);
            childO.setColors(primaryColor, this.optionalColors, optionalCount);
            childO.hideStar();
        }

    }
}


