<?php
namespace app\etick\controller;

use app\etick\model\AntiwaveFootballMatch;
use think\Controller;
use think\Session;
use think\Request;
use think\Db;

use app\etick\model\AntiwaveFootballMatch as AntiwaveFootballMatchModel;
use app\etick\model\AntiwaveFootballCompetitionGuessing as AntiwaveFootballCompetitionGuessingModel;
use app\etick\model\AntiwaveFootballLeadCompetitionGuessing as AntiwaveFootballLeadCompetitionGuessingModel;
use app\etick\model\AntiwaveFootballWelfareCompetitionGuessing as AntiwaveFootballWelfareCompetitionGuessingModel;
use app\etick\model\AntiwaveLolCompetitionGuessing as AntiwaveLolCompetitionGuessingModel;
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

        return $this->fetch();
    }

    public function GetAntiwaveFootballMatchList(){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }
        $systemTime = TimesApi::GetSystemTime();


        /*
         *         $sql = "select betting_record.*,
match_team_host.caption as hostcaption,
match_team_guest.caption as guestcaption,
 antiwave_football_match.caption as matchcaption,
 antiwave_football_match.status as matchstatus,
 antiwave_football_match.matchtime as matchtime,
 antiwave_football_competition_guessing.theodds as theodds,
 antiwave_football_competition_guessing.caption as guessingcaption
   from (select * from etick_betting_record where ordernumber = '$orderNumber') as betting_record
                join etick_antiwave_football_match as antiwave_football_match on antiwave_football_match.id = betting_record.matchid
                join etick_match_team as match_team_host on match_team_host.id = antiwave_football_match.matchteamhostid
                join etick_match_team as match_team_guest on match_team_guest.id = antiwave_football_match.matchteamguestid
                join etick_antiwave_football_competition_guessing as antiwave_football_competition_guessing on antiwave_football_competition_guessing.id = betting_record.guessingid";

         */
        //获取可显示比赛
        $sql = "select a.*,
            b.caption as hostcaption,
            c.caption as guestcaption
   from (select * from etick_antiwave_football_match where status = '0' and disappeartime > '$systemTime') as a 
                join etick_match_team as b on b.id = a.matchteamhostid
                join etick_match_team as c on c.id = a.matchteamguestid";
        $antiFootballMatchList = Db::query($sql);



//        $antiFootballMatchList = AntiwaveFootballMatchModel::where('status', 0)
//            ->whereTime('displaytime', '<=', date('Y-m-d H:i:s'))
//            ->whereTime('disappeartime', '>=', date('Y-m-d H:i:s'))
//            ->select();

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
        $systemTime = TimesApi::GetSystemTime();


        //获取可显示比赛
        $sql = "select a.*,
            b.caption as hostcaption,
            c.caption as guestcaption
   from (select * from etick_lol_match where status = '0' and disappeartime > '$systemTime') as a 
                join etick_match_team as b on b.id = a.matchteamhostid
                join etick_match_team as c on c.id = a.matchteamguestid";
        $lolMatchList = Db::query($sql);

        if(count($lolMatchList) === 0){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_NOMATCHMATCH');
        }

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($lolMatchList));

    }

    public function GetLolMatchListCompetitionGuessing(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }
        $systemTime = TimesApi::GetSystemTime();

        //matchid对应match是否存在
        $matchid = $request->param('matchid');
        if(empty($matchid)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PARAMERROR');
        }

        //当前match是否可竞猜
        $match = LolMatchModel::get($matchid);
        if($match->displaytime > $systemTime || $match->disappeartime < $systemTime){
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

    public function GetAntiwaveLolMatchList(){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        $systemTime = TimesApi::GetSystemTime();


        //获取可显示比赛
        $sql = "select a.*,
            b.caption as hostcaption,
            c.caption as guestcaption
   from (select * from etick_lol_match where status = '0' and disappeartime > '$systemTime') as a 
                join etick_match_team as b on b.id = a.matchteamhostid
                join etick_match_team as c on c.id = a.matchteamguestid";
        $antiwavelolMatchList = Db::query($sql);

        if(count($antiwavelolMatchList) === 0){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_NOMATCHMATCH');
        }

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($antiwavelolMatchList));

    }

    public function GetAntiwaveLolCompetitionGuessing(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        $systemTime = TimesApi::GetSystemTime();

        //matchid对应match是否存在
        $matchid = $request->param('matchid');
        if(empty($matchid)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PARAMERROR');
        }

        //当前match是否可竞猜
        $match = AntiwaveLolMatchModel::get($matchid);
        if($match->displaytime > $systemTime || $match->disappeartime < $systemTime){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }



        //获取对应matchid的竞猜
        $antiwaveLolcompetitionguessing = AntiwaveLolCompetitionGuessingModel::where('matchid', $matchid)->select();
        if(count($antiwaveLolcompetitionguessing) === 0){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($antiwaveLolcompetitionguessing));
    }

    public function GetAntiwaveLolMatchCompetitionGuessing(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }
        $systemTime = TimesApi::GetSystemTime();


        //matchid对应match是否存在
        $matchid = $request->param('matchid');
        if(empty($matchid)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PARAMERROR');
        }

        //当前match是否可竞猜
        $match = LolMatchModel::get($matchid);
        if($match->displaytime > $systemTime || $match->disappeartime < $systemTime){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }

        //获取对应matchid的竞猜
        $antiwavelolcompetitionguessing =
            AntiwaveLolCompetitionGuessingModel::where('matchid', $matchid)->select();
        if(count($antiwavelolcompetitionguessing) === 0){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_MATCHCANTCOMPETITION');
        }

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($antiwavelolcompetitionguessing));

    }
}