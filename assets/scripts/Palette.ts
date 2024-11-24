import { _decorator, Component, Collider2D, Contact2DType, IPhysics2DContact, log, Color } from 'cc';
const { ccclass, property } = _decorator;
import { CollisionEnum } from "./CollisionEnum";

@ccclass('Palette')
export class Palette extends Component {
    private _colors: Color[] = [];
    private _exceptColor: Color = null;
    private _primaryColor: Color = null;

    start() {
        let collider: Collider2D = this.node.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onCollider, this);
    }

    update(deltaTime: number) {

    }

    private onCollider(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        log("otherCollider onCollider " + otherCollider.node.name);
        log("selfCollider onCollider " + selfCollider.node.name);
        if (otherCollider.tag !== CollisionEnum.Player) {
            log("star onCollider not player");
            return;
        }

        this.node.parent.removeChild(this.node);
        this.node.active = false;
    }

    public setColors(colors, exceptColor): Color {

        this._colors = colors;
        this._exceptColor = exceptColor;
        return this.getPrimaryColor();
    }

    public getPrimaryColor(): Color {
        if (!this._primaryColor) {
            do {
                this._primaryColor = this._colors[Math.floor(Math.random() * this._colors.length)];
            } while (this._primaryColor == this._exceptColor);
        }
        return this._primaryColor;
    }
}


