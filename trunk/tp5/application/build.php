<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2018 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

return [
    // 生成应用公共文件
    '__file__' => ['common.php', 'config.php', 'database.php'],

    // 定义demo模块的自动生成 （按照实际定义的文件名生成）
    'etick'     => [
        '__dir__'    => ['behavior', 'controller', 'model', 'view', 'validate', 'api'],
        'controller' => ['Register', 'Login', 'ForgetPassword', 'Match', 'MatchRecord', 'Score', 'Active', 'Mine'],
        'model'      => ['User', 'CreditRecord', 'LatestThirtyTrade', 'EntrustmentBuying', 'EntrustmentSaling', 'DirectBuying', 'DirectSaling', 'FootballMatchType', 'FootballMatchTeam', 'AntiwaveFootballMatch', 'AntiwaveFootballCompetitionGuessing', 'AntiwaveFootballLeadCompetitionGuessing', 'AntiwaveFootballWelfareCompetitionGuessing', 'AntiwaveFootballBanker', 'AntiwaveFootballBankerCompetitionGuessing', 'AntiwaveFootballLeadInfo', 'LOLMatchType', 'LOLMatchTeam', 'LOLMatch', 'LOLCompetitionGuessing', 'LOLLeadCometitionGuessing', 'LOLWelfareCompetitionGuessing', 'LOLBanker', 'LOLBankerCompetitionGuessing', 'LOLLeadInfo', 'ETIRecord', 'BettingRecord', 'TeamProfit', 'Leader', 'TheLastOne', 'TheLastOneRecord', 'TheFortune', 'TheAntiFortune', 'Arbitration', 'Advice'],
        'view'       => ['register/register', 'login/login', 'forget_password/forgetpassword', 'match/match', 'match_record/matchrecord', 'score/score', 'active/active', 'mine/mine'],
        'validate'   => ['User', 'CreditRecord', 'LatestThirtyTrade', 'EntrustmentBuying', 'EntrustmentSaling', 'DirectBuying', 'DirectSaling', 'FootballMatchType', 'FootballMatchTeam', 'AntiwaveFootballMatch', 'AntiwaveFootballCompetitionGuessing', 'AntiwaveFootballLeadCompetitionGuessing', 'AntiwaveFootballWelfareCompetitionGuessing', 'AntiwaveFootballBanker', 'AntiwaveFootballBankerCompetitionGuessing', 'AntiwaveFootballLeadInfo', 'LOLMatchType', 'LOLMatchTeam', 'LOLMatch', 'LOLCompetitionGuessing', 'LOLLeadCometitionGuessing', 'LOLWelfareCompetitionGuessing', 'LOLBanker', 'LOLBankerCompetitionGuessing', 'LOLLeadInfo', 'ETIRecord', 'BettingRecord', 'TeamProfit', 'Leader', 'TheLastOne', 'TheLastOneRecord', 'TheFortune', 'TheAntiFortune', 'Arbitration', 'Advice'],
    ],
    // 其他更多的模块定义
];
