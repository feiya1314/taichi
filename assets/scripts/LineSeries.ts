import { _decorator, Component, Node, Prefab, Color, view, instantiate, UITransform, v3, log, Vec3, Sprite } from 'cc';
const { ccclass, property } = _decorator;
import Obstacle from "./Obstacle";

@ccclass('LineSeries')
export class LineSeries extends Obstacle {
    @property(Prefab)
    private linePrefab: Prefab = null;

    @property(Node)
    private starNode: Node = null;

    @property({ type: Number })
    private lineMargin = 0;

    @property({ type: Number })
    private speed = 0;

    private optionalColors: Color[] = [];

    private left: number;
    private usingColorTimes: number;
    private lines: Node[] = [];

    onLoad(): void {
        // view 一半宽度
        this.left = -view.getVisibleSize().width / 2;
        // this.lines = [];
        var line = instantiate(this.linePrefab);
        var lineUI = line.getComponent(UITransform)
        var lineNum = view.getVisibleSize().width / lineUI.width + 2;
        log("lineNum:" + lineNum);
        for (var i = 0; i < lineNum; i++) {
            var line = instantiate(this.linePrefab);
            this.node.addChild(line);

            line.setPosition(v3(-view.getVisibleSize().width / 2 + (lineUI.width + this.lineMargin) * i, 0, 0));
            this.lines[i] = line;
        }
        // 设置星星节点在最顶层
        this.starNode.setSiblingIndex(this.node.children.length - 1);
    }

    start() {

    }

    update(deltaTime: number) {
        // log("line series obstacle update");
        var firstLine = this.lines[0];
        var firstLineUI = firstLine.getComponent(UITransform);

        var firstLinePos: Vec3 = new Vec3();
        // 获取当前节点的坐标到curPos
        firstLine.getPosition(firstLinePos);

        // 第一个出界，移动到最后。
        if (firstLinePos.x < this.left - firstLineUI.width) {

            var lastLine = this.lines[this.lines.length - 1];
            var lastLinePos: Vec3 = new Vec3();
            // 获取当前节点的坐标到curPos
            lastLine.getPosition(lastLinePos);
            var lastLineUI = lastLine.getComponent(UITransform);

            firstLinePos.x = lastLinePos.x + lastLineUI.width + this.lineMargin;
            firstLine.setPosition(firstLinePos);
            if (this.optionalColors) {
                this.updateLineColor(firstLine);
            }

            this.lines.shift();
            this.lines.push(firstLine);

        }
        // 整体移动。
        for (var line of this.lines) {
            var linePos: Vec3 = new Vec3();
            line.getPosition(linePos);
            linePos.x = linePos.x - this.speed;
            line.setPosition(linePos);
        }
    }

    override setColors(primaryColor: Color, optionalColors: Color[], optionalCount: number): void {
        if (optionalCount > optionalColors.length) {
            optionalCount = optionalColors.length;
        }

        this.optionalColors = [];
        this.optionalColors[0] = primaryColor;
        while (this.optionalColors.length < optionalCount) {
            var color = optionalColors[Math.floor(Math.random() * optionalCount)];
            // if (!this.optionalColors.includes(color)) {
            var indexOf = this.optionalColors.indexOf(color);
            log("line optionalColors indexof " + indexOf);
            if (indexOf == -1) {
                this.optionalColors[this.optionalColors.length] = color;
            }
        }
        log("line setColors: " + primaryColor);

        for (var line of this.lines) {
            this.updateLineColor(line);
        }
    }

    updateLineColor(line: Node) {
        if (!this.usingColorTimes) {
            this.usingColorTimes = 0;
        }

        var sprite: Sprite = line.getComponent(Sprite);
        sprite.color = this.optionalColors[Math.floor(this.usingColorTimes / 2) % this.optionalColors.length];

        this.usingColorTimes++;
    }
}


