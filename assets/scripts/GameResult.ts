import { _decorator, Component, log, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameResult')
export class GameResult extends Component {
    @property({
        type: String,
        //控制是否在编辑器中显示该属性。
        visible: false
    })
    private lastScoreKey = 'lastScore';

    @property({ type: String, visible: false })
    private historyScoresKey = 'historyScores';

    override onLoad(): void {
        log('GameResult onLoad');
    }

    public setNewScore(newScore: number) {
        sys.localStorage.setItem(this.lastScoreKey, newScore);

        let historyScores: number[] = this.getHistoryScores();

        if (!historyScores) {
            historyScores = [0, 0, 0];
        }

        historyScores.push(newScore);
        for (var i = historyScores.length - 1; i > 0; i--) {
            if (historyScores[i] > historyScores[i - 1]) {
                var temp = historyScores[i];
                historyScores[i] = historyScores[i - 1];
                historyScores[i - 1] = temp;
            } else {
                break;
            }
        }
        historyScores.pop();

        // todo 类型
        sys.localStorage.setItem(this.historyScoresKey, JSON.stringify(historyScores));
    }

    public getLastScore(): number {
        return sys.localStorage.getItem(this.lastScoreKey);
    }

    public getHistoryScores(): number[] {

        // todo 类型
        var historyScores = sys.localStorage.getItem(this.historyScoresKey);

        return historyScores ? JSON.parse(historyScores) : historyScores;

    }

    start() {

    }

    update(deltaTime: number) {

    }
}


