import { _decorator, Component, Node, Vec3, v3, Prefab, log, Collider2D, IPhysics2DContact, Contact2DType, instantiate } from 'cc';
const { ccclass, property } = _decorator;
import { CollisionEnum } from "./CollisionEnum";

@ccclass('Star')
export class Star extends Component {
    @property({ type: Number })
    private score = 0;

    @property(Prefab)
    private capturedEffectPrefab: Prefab = null;

    public getScore(): number {
        return this.score;
    }

    start() {
        // log("Player start");
        let collider: Collider2D = this.node.getComponent(Collider2D);
        // log("player collider: " + collider);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onCollider, this);
    }

    update(deltaTime: number) {

    }

    private onCollider(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        // log("star onCollider");
        // log("star otherCollider onCollider " + otherCollider.node.name);
        // log("star selfCollider onCollider " + selfCollider.node.name);
        if (otherCollider.tag !== CollisionEnum.Player) {
            // log("star onCollider not player");
            return;
        }
        // 碰撞星星
        var deadNode = instantiate(this.capturedEffectPrefab);
        this.node.parent.addChild(deadNode);

        var curPos: Vec3 = new Vec3();
        // 获取当前节点的坐标到curPos
        this.node.getPosition(curPos);
        deadNode.setPosition(v3(curPos.x, curPos.y, curPos.z));

        // this.node.parent.removeChild(this.node);
        selfCollider.node.active = false;

        // 设置星星节点在最顶层
        // this.starNode.setSiblingIndex(this.node.children.length - 1);
    }
}


