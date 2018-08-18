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
use app\etick\model\LOLMatch as LOLMatchModel;
use app\etick\model\LOLCompetitionGuessing as LOLCompetitionGuessingModel;
use app\etick\model\LOLLeadCometitionGuessing as LOLLeadCompetitionGuessingModel;
use app\etick\model\LOLWelfareCompetitionGuessing as LOLWelfareCompetitionGuessingModel;

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

    public function GetAntiFootballMatchList(){
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

    public function GetAntiFootballMatchCompetitionGuessing(Request $request){
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
        $systemTimestamp = strtotime(TimesApi::GetSystemTime());
        if($match->displaytime > $systemTimestamp || $match->disappeartime < $systemTimestamp){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }

        //获取对应matchid的竞猜
        $antiwavefootballcompetitionguessing =
            AntiwaveFootballCompetitionGuessingModel::where('antiwavefootballmatchid', $matchid)->select();
        if(count($antiwavefootballcompetitionguessing) === 0){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($antiwavefootballcompetitionguessing));

    }

    public function GetLeadMatchListAntiFootball(Request $request){
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
        $systemTimestamp = strtotime(TimesApi::GetSystemTime());
        if($match->displaytime > $systemTimestamp || $match->disappeartime < $systemTimestamp){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }



        //获取对应matchid的竞猜
        $antiwavefootballleadcompetitionguessing = AntiwaveFootballLeadCompetitionGuessingModel::where('antiwavefootballmatchid', $matchid)->select();
        if(count($antiwavefootballleadcompetitionguessing) === 0){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($antiwavefootballleadcompetitionguessing));


    }

    public function GetWelfareMatchListAntiFootball(Request $request){
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
        $systemTimestamp = strtotime(TimesApi::GetSystemTime());
        if($match->displaytime > $systemTimestamp || $match->disappeartime < $systemTimestamp){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }



        //获取对应matchid的竞猜
        $antiwavefootballwelfarecompetitionguessing = AntiwaveFootballWelfareCompetitionGuessingModel::where('antiwavefootballmatchid', $matchid)->select();
        if(count($antiwavefootballwelfarecompetitionguessing) === 0){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($antiwavefootballwelfarecompetitionguessing));
    }

    public function GetNormalMatchListLOL(Request $request){
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
        $match = LOLMatchModel::get($matchid);
        $systemTimestamp = strtotime(TimesApi::GetSystemTime());
        if($match->displaytime > $systemTimestamp || $match->disappeartime < $systemTimestamp){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }



        //获取对应matchid的竞猜
        $lolcompetitionguessing = LOLCompetitionGuessingModel::where('lolmatchid', $matchid)->select();
        if(count($lolcompetitionguessing) === 0){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($lolcompetitionguessing));
    }

    public function GetLeadMatchListLOL(Request $request){
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
        $match = LOLMatchModel::get($matchid);
        $systemTimestamp = strtotime(TimesApi::GetSystemTime());
        if($match->displaytime > $systemTimestamp || $match->disappeartime < $systemTimestamp){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }



        //获取对应matchid的竞猜
        $lolleadcompetitionguessing = LOLLeadCompetitionGuessingModel::where('lolmatchid', $matchid)->select();
        if(count($lolleadcompetitionguessing) === 0){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($lolleadcompetitionguessing));
    }

    public function GetWelfareMatchListLOL(Request $request){
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
        $match = LOLMatchModel::get($matchid);
        $systemTimestamp = strtotime(TimesApi::GetSystemTime());
        if($match->displaytime > $systemTimestamp || $match->disappeartime < $systemTimestamp){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }



        //获取对应matchid的竞猜
        $lolwelfarecompetitionguessing = LOLWelfareCompetitionGuessingModel::where('lolmatchid', $matchid)->select();
        if(count($lolwelfarecompetitionguessing) === 0){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }
        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($lolwelfarecompetitionguessing));
    }
}