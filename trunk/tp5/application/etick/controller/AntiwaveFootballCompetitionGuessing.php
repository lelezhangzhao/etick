<?php

namespace app\etick\controller;

use app\etick\api\UserStatus;
use app\etick\model\AntiwaveFootballMatch;
use app\etick\model\AntiwaveFootballWelfareCompetitionGuessing;
use think\Controller;
use think\Session;
use think\Request;
use think\Validate;


use app\etick\model\User as UserModel;
use app\etick\model\AntiwaveFootballMatch as AntiwaveFootballMatchModel;
use app\etick\model\AntiwaveFootballCompetitionGuessing as AntiwaveFootballCompetitionGuessing;
use app\etick\model\AntiwaveFootballLeadCompetitionGuessing as AntiwaveFootballLeadCompetitionGuessing;
use app\etick\model\AntiwaveFootballBankerCompetitionGuessing as AntiwaveFootballBankerCompetitionGuessing;
use app\etick\model\LOLMatch as LOLMatchModel;
use app\etick\model\LOLCompetitionGuessing as LOLCompetitionGuessingModel;
use app\etick\model\LOLLeadCometitionGuessing as LOLLeadCompetitionGuessingModel;
use app\etick\model\LOLBankerCompetitionGuessing as LOLBankerComptitionGuessingModel;
use app\etick\model\BettingRecord as BettingRecordModel;

use app\etick\api\Status as StatusApi;
use app\etick\api\Database as DatabaseApi;
use app\etick\api\Times as TimesApi;
use app\etick\api\UserStatus as UserStatusApi;
use app\etick\api\Util as UtilApi;

class CompetitionGuessing extends Controller{
    public function BettingCompetitionGuessing(Request $request){
        //用户状态
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        //获取参数
        $matchid = $request->param('matchid');
        $guessingtype = $request->param('competitionguessingtype');
        $guessingid = $request->param('competitionguessingid');
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
                $guessing = AntiwaveFootballCompetitionGuessing::get($guessingid);
                break;
            case 1:
                $guessing = AntiwaveFootballLeadCompetitionGuessing::get($guessingid);
                break;
            case 2:
                $guessing = AntiwaveFootballWelfareCompetitionGuessing::get($guessingid);
                break;
            case 3:
                $guessing = AntiwaveFootballBankerCompetitionGuessing::get($guessingid);
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
        if($user->eti < $eti){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_ETIISNOTENOUGH');
        }


        //暂不使用事务

        //改变竞猜剩余额度
        $guessing->remaineti -= $eti;
        $guessing->allowField(true)->save();

        //改变用户额度
        $user->eti -= $eti;
        $user->allowField(true)->save();

        //插入bettingrecord


    }
}


