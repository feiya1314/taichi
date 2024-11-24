import {
    _decorator,
    Component,
    Node,
    Prefab,
    AudioClip,
    log,
    ParticleSystem2D,
    Color,
    Collider2D,
    Contact2DType,
    IPhysics2DContact,
    Vec3,
    view,
    Tween,
    tween,
    AudioSource,
    instantiate,
    Sprite,
    ProgressBar,
    v3
} from 'cc';

const { ccclass, property } = _decorator;
import { Game } from "./Game";
import { ObstacleSet } from "./ObstacleSet";
import { Star } from "./Star";
import { Palette } from "./Palette";
import { CollisionEnum } from "./CollisionEnum";
import { ProtectiveCover } from "./ProtectiveCover";

@ccclass('Player')
export class Player extends Component {
    @property(Node)
    private protectivePBNode: Node = null;

    @property({ type: Number })
    private jumpHeight = 0;

    @property({ type: Number })
    private jumpDuration = 0;

    @property({ type: Number })
    private sinkDuration = 0;

    @property(Prefab)
    private deadEffectPrefab: Prefab = null;

    @property(AudioClip)
    private deadAudioClip: AudioClip = null;

    @property(AudioClip)
    private capturedGiftAudioClip: AudioClip = null;

    @property(ObstacleSet)
    private obstacleSet: ObstacleSet = null;

    private _game: Game = null;
    private isProtectived: boolean = false;

    private audioSource = new AudioSource();

    private startColorCache: Color = null;

    private step: number = 0;
    override onLoad(): void {
        log("Player onLoad");
        // this.updateStyle(this.node.color);
    }

    private updateStyle(color: Color) {
        var partical: ParticleSystem2D = this.node.getComponent(ParticleSystem2D);
        // this.node.color = color;
        partical.startColor = color;
        partical.endColor = color;
    }

    private notifyObstacleSetJump(jumpHeight: number, jumpDuration: number) {
        this.obstacleSet.moveDown(jumpHeight, jumpDuration);
    }

    start() {
        log("Player start");
        let collider: Collider2D = this.node.getComponent(Collider2D);
        // log("player collider: " + collider);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onCollider, this);
    }

    private onCollider(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        // log("player onCollider ");
        // log("player selfCollider " + selfCollider.group + "," + selfCollider.tag);
        // log("player otherCollider " + otherCollider.group + "," + otherCollider.tag);
        //检测到碰撞
        switch (otherCollider.tag) {
            // 碰到障碍物
            case CollisionEnum.Obstacle:
                var otherSprite = otherCollider.node.getComponent(Sprite);
                var partical: ParticleSystem2D = this.node.getComponent(ParticleSystem2D);
                if (!this.isProtectived && !otherSprite.color.equals(partical.startColor)) {
                    log("player hit obstacle,gameover");
                    this.gameOver();
                }
                break;
            //碰到星星
            case CollisionEnum.Star:
                // log("player hit Star, play sound");
                this._game.captureStar(otherCollider.node.getComponent(Star).getScore());
                this.audioSource.playOneShot(this.capturedGiftAudioClip);
                // audioEngine.play(this.capturedGiftAudioClip, false, 0.3);
                break;
            case CollisionEnum.Palette:// 碰到变色板
                // log("player hit Palette, updateStyle");
                this.updateStyle(otherCollider.node.getComponent(Palette).getPrimaryColor());
                break;
            case CollisionEnum.Protective:// 碰到保护罩
                log("player hit Protective");
                this.protective(otherCollider.node.getComponent(ProtectiveCover).protectiveDuration);
                break;
        }
    }

    private protective(duration: number) {
        log("player protective protectiveDuration:" + duration);
        //当前已经是有保护色的情况，重新计算
        if (this.isProtectived) {
            this.unschedule(this.updateProtective);
        }

        this.isProtectived = true;

        // player的粒子系统
        var partical = this.node.getComponent(ParticleSystem2D);

        // 记录粒子系统粒子碰撞到保护颜色时的颜色变化范围
        if (!this.startColorCache) {
            // 这里要用clone，不然startColorVar可能会被修改
            this.startColorCache = partical.startColorVar.clone();
            // log("startColorCache " + this.startColorCache);
        }
        // 设置player 粒子初始颜色变化范围为白色，最开始是黑色，start和end，颜色会在这个范围内动态随机
        partical.startColorVar = Color.WHITE;

        // 开启保护色持续时间进度条
        this.protectivePBNode.active = true;
        var progressBar = this.protectivePBNode.getComponent(ProgressBar);
        progressBar.progress = 1;
        var interval = 16 / 1000;
        // log("progressBar.totalLength " + progressBar.totalLength);
        // progressBar.progress = progressBar.totalLength / (duration / interval);
        this.step = progressBar.totalLength / (duration / interval);
        // interval 秒为间隔，16毫秒一次
        this.schedule(this.updateProtective, interval);
    }

    private updateProtective() {
        var progressBar = this.protectivePBNode.getComponent(ProgressBar);
        progressBar.progress -= this.step;
        if (progressBar.progress > 0) {
            return;
        }
        this.isProtectived = false;

        // log("this.node  " + this.node.name);
        var partical = this.node.getComponent(ParticleSystem2D);
        // log("updateProtective startColorCache " + this.startColorCache);
        partical.startColorVar = this.startColorCache;

        this.protectivePBNode.active = false;

        this.unschedule(this.updateProtective);
    }

    update(deltaTime: number) {

    }

    public jump() {
        // log("player jump");
        Tween.stopAllByTarget(this.node);

        // 当前视图的尺寸 视图窗口可见区域尺寸
        // log("view size:" + view.getVisibleSize());
        // log("getViewportRect size:" + view.getViewportRect());
        // window size 当前窗口的物理像素尺寸。 注意 - 设置窗口尺寸目前只在 Web 平台上支持
        // log("windowSize size:" + screen.windowSize);
        // log("supportsFullScreen  " + screen.supportsFullScreen);

        // 尝试使当前节点进入全屏模式
        // log("supportsFullScreen  " + screen.requestFullScreen());
        //当前是否是全屏模式
        // log("fullScreen  " + screen.fullScreen());

        // 偏移量
        var jumpOffsetY = this.jumpHeight;
        // player 节点坐标，这个是相对坐标，
        var curPos: Vec3 = new Vec3();
        // 获取当前节点的坐标到curPos
        this.node.getPosition(curPos);
        // log("player pos:" + curPos)

        // // 如果超过了中间位置,则往下跳
        if (curPos.y + this.jumpHeight > 0) {
            jumpOffsetY = -curPos.y;
            // 超过了中间位置 障碍物则往下落 jumpHeight高度
            // todo 这里直接依赖 障碍物node不行吗
            this.notifyObstacleSetJump(this.jumpHeight, this.jumpDuration);
        }
        // 先跳再下坠，跳持续时间 
        // by 是创建一个相对动作，使节点的 x 坐标在指定时间内内平滑增加 多少
        // to 方法使节点的某个属性在指定时间内平滑过渡到目标值。例如使节点的 position.x 属性在 2 秒内平滑过渡到 300。
        var jump = tween(this.node).by(this.jumpDuration,
            { position: new Vec3(0, jumpOffsetY, 0) },
            { easing: "cubicOut", });

        // 落到底部
        var sinkOffsetY = -view.getVisibleSize().y / 2 - 10;
        // log("sinkOffsetY:" + sinkOffsetY);
        var sink = tween(this.node).by(this.sinkDuration,
            { position: new Vec3(0, sinkOffsetY, 0) },
            { easing: "cubicIn" }); // 缓动函数，可以使用已有的，也可以传入自定义的函数。

        tween(this.node).sequence(jump, sink).start();
    }

    private gameOver() {
        if (!this.node.active) {
            return;
        }

        // 爆炸动画
        var deadNode = instantiate(this.deadEffectPrefab);
        this.node.parent.addChild(deadNode);

        var curPos: Vec3 = new Vec3();
        // 获取当前节点的坐标到curPos
        this.node.getPosition(curPos);
        deadNode.setPosition(v3(curPos.x, curPos.y, curPos.z));

        this.node.active = false;

        this.audioSource.playOneShot(this.deadAudioClip);
        // audioEngine.play(this.deadAudioClip, false, 0.3);

        this.scheduleOnce(this._game.gameOver.bind(this._game), 1);
    }

    set game(game: Game) {
        this._game = game;
    }
}


