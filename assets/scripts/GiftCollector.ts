import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GiftCollector')
export class GiftCollector extends Component {
    @property(Node)
    private starScoreNode: Node = null;

    private starCount: number = 0;
    private score: number = 0;

    public getScore(): number {
        return this.score;
    }

    public captureStar(score: number) {
        this.starCount = this.starCount + 1;
        this.score = this.score + score;
        this.starScoreNode.getComponent(Label).string = this.starCount.toString();
    }

    start() {
    }

    update(deltaTime: number) {

    }
}


