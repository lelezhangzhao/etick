<?php

namespace app\etick\controller;

use app\etick\api\Database;
use app\etick\api\UserStatus;
use app\etick\model\AntiwaveFootballMatch;
use app\etick\model\AntiwaveFootballWelfareCompetitionGuessing;
use think\Controller;
use think\Session;
use think\Request;
use think\Validate;


use app\etick\model\User as UserModel;
use app\etick\model\AntiwaveFootballMatch as AntiwaveFootballMatchModel;
use app\etick\model\AntiwaveFootballCompetitionGuessing as AntiwaveFootballCompetitionGuessingModel;
use app\etick\model\AntiwaveFootballLeadCompetitionGuessing as AntiwaveFootballLeadCompetitionGuessingModel;
use app\etick\model\AntiwaveFootballBankerCompetitionGuessing as AntiwaveFootballBankerCompetitionGuessingModel;
use app\etick\model\LolMatch as LolMatchModel;
use app\etick\model\LolCompetitionGuessing as LolCompetitionGuessingModel;
use app\etick\model\LolLeadCometitionGuessing as LolLeadCompetitionGuessingModel;
use app\etick\model\LolBankerCompetitionGuessing as LolBankerComptitionGuessingModel;
use app\etick\model\BettingRecord as BettingRecordModel;

use app\etick\api\Status as StatusApi;
use app\etick\api\Database as DatabaseApi;
use app\etick\api\Times as TimesApi;
use app\etick\api\UserStatus as UserStatusApi;
use app\etick\api\Util as UtilApi;

class AntiwaveFootballCompetitionGuessing extends Controller{
    public function BettingCompetitionGuessing(Request $request){
        //用户状态
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        //获取参数
        $matchid = $request->param('matchid');
        $guessingtype = $request->param('guessingtype');
        $guessingid = $request->param('guessingid');
        $eti = $request->param('eti');
        $userid = Session::get('userid');


        $user = UserModel::get($userid);
        if(empty($user)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_USERISNOTEXIST');
        }

        $match = AntiwaveFootballMatchModel::get($matchid);
        if(empty($match)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_NOMATCHMATCH');
        }

        $istypelegal = Validate::regex($guessingtype, '/^[0-3]$/');
        if(true !== $istypelegal){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHTYPEERROR');
        }

        switch($guessingtype){
            case 0:
                $guessing = AntiwaveFootballCompetitionGuessingModel::get($guessingid);
                break;
            case 1:
                $guessing = AntiwaveFootballLeadCompetitionGuessingModel::get($guessingid);
                break;
            case 2:
                $guessing = AntiwaveFootballWelfareCompetitionGuessingModel::get($guessingid);
                break;
            case 3:
                $guessing = AntiwaveFootballBankerCompetitionGuessingModel::get($guessingid);
                break;
            default:
                return StatusApi::ReturnErrorStatus('ERROR_STATUS_HACKER');
                break;
        }

        if(empty($guessing)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_COMPETITIONGUESSINGISNOTEXIST');
        }

        $systemTime = TimesApi::GetSystemTime();
        //比赛未开始竞猜
        if($match->displaytime >= $systemTime){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHISNOTDISPLAY');
        }

        //竞猜已结束
        if($match->disappeartime <= $systemTime || $match->matchtime <= $systemTime){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_COMPETITIONGUESSINGISSTOP');
        }

        //用户余额够
//        if($user->eti < $eti){
//            return StatusApi::ReturnErrorStatus('ERROR_STATUS_ETIISNOTENOUGH');
//        }


        //暂不使用事务

        //改变竞猜剩余额度
        $guessing->remaineti -= $eti;
        $guessing->allowField(true)->save();

        //改变用户额度
        $user->eti -= $eti;
        $user->allowField(true)->save();

        //插入bettingrecord
        DatabaseApi::AddBettingRecord($userid, 0, 0, $matchid, $guessingid, $eti, 0);
        return StatusApi::ReturnJson('ERROR_STATUS_SUCCESS', '下注成功');

    }
}


