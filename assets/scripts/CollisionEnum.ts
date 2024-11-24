// 碰撞物品枚举，对应碰撞物品TAG
export enum CollisionEnum{
    // 默认的碰撞tag 0
    Default,
    // 障碍物 1
    Obstacle,
    // 星星用来得分 2
    Star,
    // Player 3
    Player,
    // 调色板 4
    Palette,
    //保护色，该状态为无敌模式 5
    Protective
}