import { _decorator, Component, Node, sys, SubContextView, director, Label, log } from 'cc';
import { GameResult } from "./GameResult";
const { ccclass, property } = _decorator;

@ccclass('GameOver')
export class GameOver extends Component {
    @property(Node)
    private currentScoreNode: Node = null;

    @property(Node)
    private highestScoreRootNode: Node = null;

    @property(Node)
    private historyNode: Node = null;

    @property(Node)
    private firstScoreNode: Node = null;

    @property(Node)
    private secondScoreNode: Node = null;

    @property(Node)
    private thirdScoreNode: Node = null;

    @property(Node)
    private friendTopRankingNode: Node = null;

    @property(SubContextView)
    private friendTopRankingWXSubContextView: SubContextView = null;

    @property(Node)
    private friendRankingNode: Node = null;

    private isLoadedFriendRanking: boolean = false;

    onLoad() {
        var gameResult = this.node.getComponent(GameResult);
        var label = this.currentScoreNode.getComponent(Label);
        label.string = gameResult.getLastScore().toString();

        if (sys.platform === sys.Platform.WECHAT_GAME) {
            this.historyNode.active = false;
            this.friendTopRankingNode.active = true;
            this.highestScoreRootNode.active = true;

            // this.highestScoreRootNode.getChildByName('Score').getComponent(Label).string = window.userInfo.highestScore;

            // var score = gameResult.getLastScore();

            // if (score > window.userInfo.highestScore) {
            //     window.userInfo.highestScore = score;
            //     wx.cloud.callFunction({
            //         name: 'uploadHighestScore',
            //         data: { score: score },
            //         success: res => { cc.log(res) },
            //         fail: error => { cc.error(error); }
            //     });
            // }

            // wx.getOpenDataContext().postMessage({ type: 'updateScore', score: score });
            // wx.getOpenDataContext().postMessage({ type: 'showFriendTopRanking' });

            return;
        }

        this.highestScoreRootNode.active = false;
        this.friendTopRankingNode.active = false;
        this.historyNode.active = true;

        var historyScores = gameResult.getHistoryScores();

        this.firstScoreNode.getComponent(Label).string = historyScores[0].toString();
        this.secondScoreNode.getComponent(Label).string = historyScores[1].toString();
        this.thirdScoreNode.getComponent(Label).string = historyScores[2].toString();
    }

    public playAgain() {
        if (sys.platform === sys.Platform.WECHAT_GAME) {
            // getOpenDataContext().postMessage({ type: 'close' });
        }
        log('play again');
        director.loadScene('Main');
    }

    public showFriendRanking() {

        this.friendTopRankingWXSubContextView.enabled = false;

        if (!this.isLoadedFriendRanking) {
            // wx.getOpenDataContext().postMessage({ type: 'showFriendRanking' });
            this.isLoadedFriendRanking = true;
        }

        // this.friendRankingNode.on(Node.EventType.TOUCH_START, () => { });

        // 延时显示，等待子域切换场景
        // this.friendRankingNode.active = true;
        // this.friendRankingNode.opacity = 0;
        // this.scheduleOnce(((dt) => this.friendRankingNode.opacity = 255), 0.1);

    }

    hideFriendRanking() {

        this.friendRankingNode.active = false;

    }

    start() {

    }

    update(deltaTime: number) {

    }
}


