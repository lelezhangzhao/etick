<?php
namespace app\etick\controller;

use think\Controller;

use app\etick\api\UserStatus as UserStatusApi;

use app\etick\model\BettingRecord as BettingRecordModel;
use app\etick\model\AntiwaveFootballMatch as AntiwaveFootballMatchModel;
use app\etick\model\AntiwaveFootballCompetitionGuessing as AntiwaveFootballCompetitionGuessingModel;
use app\etick\model\AntiwaveFootballLeadCompetitionGuessing as AntiwaveFootballLeadCompetitionGuessingModel;
use app\etick\model\AntiwaveFootballWelfareCompetitionGuessing as AntiwaveFootballWelfareCompetitionGuessingModel;
use app\etick\model\AntiwaveFootballBankerCompetitionGuessing as AntiwaveFootballBankerCompetitionGuessingModel;
use app\etick\model\FootballMatchTeam as FootballMatchTeamModel;
use app\etick\model\FootballMatchType as FootballMatchTypeModel;

class MatchRecord extends Controller{
    public function Index(){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        return $this->fetch();
    }

    public function GetMatchRecord(){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        $userid = Session::get('userid');

        $antiwaveFootballBettingRecord =
            Db::view('BettingRecord', 'ordernumber, bettingeti, status, statusinfo, profit, bettingtime, balancetime, etistatus, etistatusinfo')
            ->where('userid', $userid)
            ->where('etickmatchtype', 0)
            ->view('AntiwaveFootballMatch', ['caption' => 'matchcaption', 'matchtime'], 'AntiwaveFootballMatch.id = BettingRecord.matchid')
            ->view('FootballMatchType', ['caption' => 'matchtypecaption'], 'FootballMatchType.id = AntiwaveFootballMatch.matchtypeid')
            ->view('FootballMatchTeam', ['caption' => 'hostteamcaption'], 'FootballMatchTeam.id = AntiwaveFootballMatch.matchteamhostid')
            ->view('FootballMatchTeam', ['caption' => 'guestteamcaption'], 'FootballMatchTeam.id = AntiwaveFootballMatch.matchteamguestid')
            ->view('AntiwaveFootballCompetitionGuessing', 'score, theodds', 'AntiwaveFootballCompetitionGuessing.id = BettingRecord.guessingid')
            ->select();

        dump($antiwaveFootballBettingRecord);


    }
}