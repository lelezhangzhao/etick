<?php
namespace app\etick\controller;

use app\etick\model\AntiwaveFootballMatch;
use think\Controller;
use think\Session;
use think\Request;

use app\etick\model\AntiwaveFootballMatch as AntiwaveFootballMatchModel;
use app\etick\model\AntiwaveFootballCompetitionGuessing as AntiwaveFootballCompetitionGuessingModel;
use app\etick\model\AntiwaveFootballLeadCompetitionGuessing as AntiwaveFootballLeadCompetitionGuessingModel;
use app\etick\model\AntiwaveFootballWelfareCompetitionGuessing as AntiwaveFootballWelfareCompetitionGuessingModel;
use app\etick\model\LolMatch as LolMatchModel;
use app\etick\model\LolCompetitionGuessing as LolCompetitionGuessingModel;
use app\etick\model\LolLeadCometitionGuessing as LolLeadCompetitionGuessingModel;
use app\etick\model\LolWelfareCompetitionGuessing as LolWelfareCompetitionGuessingModel;

use app\etick\api\Status as StatusApi;
use app\etick\api\Times as TimesApi;
use app\etick\api\UserStatus as UserStatusApi;

class Match extends Controller{
    public function Index(){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        return $this->fetch('antiwavefootballmatch');
    }

    public function GetAntiwaveFootballMatchList(){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        //获取可显示比赛
        $antiFootballMatchList = AntiwaveFootballMatch::where('status', 0)
            ->whereTime('displaytime', '<=', date('Y-m-d H:i:s'))
            ->whereTime('disappeartime', '>=', date('Y-m-d H:i:s'))
            ->select();

        if(count($antiFootballMatchList) === 0){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_NOMATCHMATCH');
        }

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($antiFootballMatchList));
    }

    public function GetAntiWaveFootballMatchCompetitionGuessing(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        //matchid对应match是否存在
        $matchid = $request->param('matchid');
        if(empty($matchid)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PARAMERROR');
        }

        //当前match是否可竞猜
        $match = AntiwaveFootballMatchModel::get($matchid);
        $systemTimestamp = TimesApi::GetSystemTime();
        if($match->displaytime > $systemTimestamp || $match->disappeartime < $systemTimestamp){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }

        //获取对应matchid的竞猜
        $antiwavefootballcompetitionguessing =
            AntiwaveFootballCompetitionGuessingModel::where('matchid', $matchid)->select();
        if(count($antiwavefootballcompetitionguessing) === 0){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($antiwavefootballcompetitionguessing));

    }

    public function GetAntiwaveFootballMatchListLeadCompetitionGuessing(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        //matchid对应match是否存在
        $matchid = $request->param('matchid');
        if(empty($matchid)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PARAMERROR');
        }

        //当前match是否可竞猜
        $match = AntiwaveFootballMatchModel::get($matchid);
        $systemTimestamp = TimesApi::GetSystemTime();
        if($match->displaytime > $systemTimestamp || $match->disappeartime < $systemTimestamp){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }



        //获取对应matchid的竞猜
        $antiwavefootballleadcompetitionguessing = AntiwaveFootballLeadCompetitionGuessingModel::where('matchid', $matchid)->select();
        if(count($antiwavefootballleadcompetitionguessing) === 0){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($antiwavefootballleadcompetitionguessing));


    }

    public function GetAntiwaveFootballMatchListWelfareCompetitionGuessing(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        //matchid对应match是否存在
        $matchid = $request->param('matchid');
        if(empty($matchid)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PARAMERROR');
        }

        //当前match是否可竞猜
        $match = AntiwaveFootballMatchModel::get($matchid);
        $systemTimestamp = TimesApi::GetSystemTime();
        if($match->displaytime > $systemTimestamp || $match->disappeartime < $systemTimestamp){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }



        //获取对应matchid的竞猜
        $antiwavefootballwelfarecompetitionguessing = AntiwaveFootballWelfareCompetitionGuessingModel::where('matchid', $matchid)->select();
        if(count($antiwavefootballwelfarecompetitionguessing) === 0){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($antiwavefootballwelfarecompetitionguessing));
    }

    public function GetLolMatchList(){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        //获取可显示比赛
        $LolMatchList = LolMatchModel::where('status', 0)
            ->whereTime('displaytime', '<=', date('Y-m-d H:i:s'))
            ->whereTime('disappeartime', '>=', date('Y-m-d H:i:s'))
            ->select();

        if(count($LolMatchList) === 0){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_NOMATCHMATCH');
        }

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($LolMatchList));

    }

    public function GetLolMatchListCompetitionGuessing(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        //matchid对应match是否存在
        $matchid = $request->param('matchid');
        if(empty($matchid)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PARAMERROR');
        }

        //当前match是否可竞猜
        $match = LolMatchModel::get($matchid);
        $systemTimestamp = TimesApi::GetSystemTime();
        if($match->displaytime > $systemTimestamp || $match->disappeartime < $systemTimestamp){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }



        //获取对应matchid的竞猜
        $Lolcompetitionguessing = LolCompetitionGuessingModel::where('matchid', $matchid)->select();
        if(count($Lolcompetitionguessing) === 0){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($Lolcompetitionguessing));
    }

    public function GetLolMatchListLeadCompetitionGuessing(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        //matchid对应match是否存在
        $matchid = $request->param('matchid');
        if(empty($matchid)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PARAMERROR');
        }

        //当前match是否可竞猜
        $match = LolMatchModel::get($matchid);
        $systemTimestamp = TimesApi::GetSystemTime();
        if($match->displaytime > $systemTimestamp || $match->disappeartime < $systemTimestamp){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }



        //获取对应matchid的竞猜
        $Lolleadcompetitionguessing = LolLeadCompetitionGuessingModel::where('matchid', $matchid)->select();
        if(count($Lolleadcompetitionguessing) === 0){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($Lolleadcompetitionguessing));
    }

    public function GetLolMatchListWelfareCompetitionGuessing(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        //matchid对应match是否存在
        $matchid = $request->param('matchid');
        if(empty($matchid)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PARAMERROR');
        }

        //当前match是否可竞猜
        $match = LolMatchModel::get($matchid);
        $systemTimestamp = TimesApi::GetSystemTime();
        if($match->displaytime > $systemTimestamp || $match->disappeartime < $systemTimestamp){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }



        //获取对应matchid的竞猜
        $Lolwelfarecompetitionguessing = LolWelfareCompetitionGuessingModel::where('matchid', $matchid)->select();
        if(count($Lolwelfarecompetitionguessing) === 0){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }
        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($Lolwelfarecompetitionguessing));
    }
}