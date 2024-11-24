import { _decorator, Component, Node, Prefab, Color, log, Vec3, view, tween, NodePool, instantiate, UITransform, v3 } from 'cc';
const { ccclass, property } = _decorator;

import { Palette } from "./Palette";
import Obstacle from "./Obstacle";

@ccclass('ObstacleSet')
export class ObstacleSet extends Component {

    // Player类型，使用时需要Node挂载Player脚本，才能注入
    // @property(Player)
    // private palyer: Player = null;

    // [Prefab] 代表Prefab数组类型，要使用Prefab[] = []默认值，这样才可以在编辑器中配置元素个数
    @property([Prefab])
    private obstaclesPrefab: Prefab[] = [];

    @property(Prefab)
    private startObstaclePrefab: Prefab = null;

    // 变色版预制体
    @property(Prefab)
    private palettePrefab: Prefab = null;

    @property(Prefab)
    private protectiveCoverPrefab: Prefab = null;

    @property({ type: Number })
    private protectiveProbability = 0.05;

    @property([Color])
    private optionalColors: Color[] = [];

    // private primaryColor: Color;

    private usingColorCount: number = 0;
    private obstacleMargin: number = 0;
    private palletePool: NodePool = new NodePool();
    private lastPrimaryColor: Color = null;

    override onLoad(): void {
        // log("ObstacleSet onLoad");
        // log("optionalColors length: " + this.optionalColors.length);
        // log("optionalColors  " + this.optionalColors);
        // if (this.optionalColors.length > 0) {
        //     log("init primaryColor");
        //     this.primaryColor = this.optionalColors[0];
        // }

        // var canvas: Canvas = this.node.getComponent(Canvas);

        // var uiTransform: UITransform = this.node.getComponent(UITransform);
        // log("canvas: " + canvas);
        // log("UITransform height: " + uiTransform.height);
        // log("UITransform width: " + uiTransform.width);
        // this.node.width = canvas.width;
        // this.node.height = canvas.height;

        // 三分之一高度
        this.obstacleMargin = view.getVisibleSize().y / 3;
    }

    public moveDown(moveDistence: number, jumpDuration: number) {
        // 0 是 dead line , 所以从 1 开始。
        var firstChild = this.node.children[1];

        var firstChildUI: UITransform = firstChild.getComponent(UITransform);
        var firstChildPos = new Vec3();
        firstChild.getPosition(firstChildPos);

        // 底下的第一个节点在底部的位置时，移除节点
        if (firstChildPos.y + firstChildUI.height / 2 < -view.getVisibleSize().y / 2) {
            this.node.removeChild(firstChild);
            var paletteComp = firstChild.getComponent(Palette);
            log("paletteComp: " + paletteComp);
            if (paletteComp) {
                log("palletePool put " + firstChild.name);
                this.palletePool.put(firstChild);
            }
        }

        var lastChild = this.node.children[this.node.children.length - 1];
        var lastChildPos = new Vec3();
        lastChild.getPosition(lastChildPos);
        var lastChildUI: UITransform = lastChild.getComponent(UITransform);
        // var curUI: UITransform = this.node.getComponent(UITransform);

        var lastChildTop = lastChildPos.y + lastChildUI.height / 2;
        if (lastChildTop < view.getVisibleSize().y / 2) {
            // 生成新的障碍
            var bottom = lastChildTop + this.obstacleMargin;
            this.createObstacle(bottom, this.createPallete(bottom), null);
        }

        // 整体移动
        for (var child of this.node.children) {
            if (child.name == 'DeadLine') {
                continue;
            }
            // child.runAction(cc.moveBy(jumpDuration, cc.v2(0, distance > 0 ? -distance : distance)));
            tween(child).by(jumpDuration,
                { position: v3(0, moveDistence > 0 ? -moveDistence : moveDistence, 0) },
                { easing: "sineOut" }
            ).start();
        }
    }

    start() {
        // 生成新的障碍
        this.createObstacle(this.obstacleMargin, this.createPallete(this.obstacleMargin), this.startObstaclePrefab)
    }

    // 创建变色板
    private createPallete(bottom: number) {
        // todo 优化palette，可以启动时加载多个，active 设置为false，// 确认是否parent为null
        var palette: Node = this.palletePool.get();
        if (!palette) {
            // log("createPallete not exist,crate new one");
            palette = instantiate(this.palettePrefab);
        }
        this.node.addChild(palette);

        var uiTransform: UITransform = palette.getComponent(UITransform);
        var paletteHeight = uiTransform.height;
        // log("palette height " + paletteHeight + "obstacleMargin: " + this.obstacleMargin);
        // 320 - 320/2 + 15 = 175
        var palettePosY = bottom - this.obstacleMargin / 2 + paletteHeight / 2
        // log("palette setPosition y:" + palettePosY);
        palette.setPosition(v3(0, palettePosY, 0));

        var palleteComponent: Palette = palette.getComponent(Palette);

        // 获取变色版的颜色,用于改变player颜色
        var primaryColor = palleteComponent.setColors(this.optionalColors, this.lastPrimaryColor);

        this.lastPrimaryColor = primaryColor;

        // 保护色的变色版
        if (Math.random() < this.protectiveProbability) {
            var palettePos: Vec3 = new Vec3();
            palette.getPosition(palettePos);

            this.node.removeChild(palette);
            var paletteX = palettePos.x;
            var paletteY = palettePos.y;
            var protectiveCover = instantiate(this.protectiveCoverPrefab);
            this.node.addChild(protectiveCover);

            protectiveCover.setPosition(v3(paletteX, paletteY, 0));
        }

        return primaryColor;
    }

    // 创建障碍物 obstaclePrefab 优先用的障碍物,没传则随机生成障碍物
    createObstacle(bottom: number, primaryColor: Color, obstaclePrefab: Prefab) {
        log("createObstacle");
        if (this.usingColorCount < this.optionalColors.length) {
            this.usingColorCount++;
        }
        if (!obstaclePrefab) {
            // 随机选取障碍物
            obstaclePrefab = this.obstaclesPrefab[Math.floor((Math.random() * this.obstaclesPrefab.length))];
            // obstaclePrefab = this.obstaclesPrefab[2];
            // obstaclePrefab = this.startObstaclePrefab;
            log("随机选取障碍物: " + obstaclePrefab.name)
        }
        var obstacle = instantiate(obstaclePrefab);
        this.node.addChild(obstacle);

        var uiTransform: UITransform = obstacle.getComponent(UITransform);
        var obstacleHeight = uiTransform.height;

        log("obstacle y " + (bottom + obstacleHeight / 2));
        obstacle.setPosition(v3(0, bottom + obstacleHeight / 2, 0));

        // var scriptName = obstacle.name[0].toLowerCase() + obstacle.name.slice(1);
        // log("obstacle scriptName: " + scriptName);
        var obstacleComp: Obstacle = obstacle.getComponent(Obstacle);
        // log("obstacleComp type: " + (instanceof obstacleComp));
        obstacleComp.setColors(primaryColor, this.optionalColors, this.usingColorCount);
    }

    update(deltaTime: number) {

    }
}


