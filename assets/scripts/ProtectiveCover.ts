import { _decorator, Component, Node, Collider2D, Contact2DType, log, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;
import { CollisionEnum } from "./CollisionEnum";

@ccclass('ProtectiveCover')
export class ProtectiveCover extends Component {
    @property({ type: Number })
    public protectiveDuration = 5;

    start() {
        let collider: Collider2D = this.node.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onCollider, this);
    }


    private onCollider(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        if (otherCollider.tag !== CollisionEnum.Player) {
            log("star onCollider not player");
            return;
        }

        this.node.parent.removeChild(this.node);
        this.node.active = false;
    }

    update(deltaTime: number) {

    }
}


