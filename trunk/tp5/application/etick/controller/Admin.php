<?php

namespace app\etick\controller;

use think\Controller;
use think\Request;
use think\Db;

use app\etick\api\UserStatus as UserStatusApi;
use app\etick\api\Status as StatusApi;
use app\etick\api\Database as DatabaseApi;
use app\etick\api\Times as TimesApi;

use app\etick\model\EtickMatchType as EtickmatchTypeModel;
use app\etick\model\MatchType as MatchTypeModel;
use app\etick\model\MatchTeam as MatchTeamModel;
use app\etick\model\AntiwaveFootballMatch as AntiwaveFootballMatchModel;
use app\etick\model\AntiwaveFootballCompetitionGuessing as AntiwaveFootballCompetitionGuessingModel;
use app\etick\model\LolMatch as LolMatchModel;
use app\etick\model\LolCompetitionGuessing as LolCompetitionGuessingModel;
use app\etick\model\BettingRecord as BettingRecordModel;
use app\etick\model\EtiRecord as EtiRecordModel;
use app\etick\model\User as UserModel;
use app\etick\model\TeamProfit as TeamProfitModel;


class Admin extends Controller
{
    public function Index()
    {
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }

        return $this->fetch();
    }

    public function GetEtickMatchType()
    {
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }

//        $json_arr = [0 => "足球返波胆", 1 => "英雄联盟返波胆"];
        $matchtype = EtickMatchTypeModel::all();

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($matchtype));

    }

    public function GetMatchType(Request $request)
    {
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }

        $etickmatchtypeid = $request->param('etickmatchtype');

        $matchtype = MatchTypeModel::where('etickmatchtypeid', $etickmatchtypeid)->select();

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($matchtype));

    }

    public function GetMatchByMatchType(Request $request){
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }

        $etickmatchtypeid = $request->param('etickmatchtypeid');
        $matchtypeid = $request->param('matchtypeid');

        if($etickmatchtypeid === '1'){
            $match = AntiwaveFootballMatchModel::where('matchtypeid', $matchtypeid)->where('status', 'in', '0,1,2')->select();
            return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($match));

        }else if($etickmatchtypeid === '2'){
            $match = LolMatchModel::where('matchtypeid', $matchtypeid)->where('status', 'in', '0,1,2')->select();
            return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($match));
        }
        return StatusApi::ReturnErrorStatus('ERROR_STATUS_PARAMERROR');
    }

    public function GetHostAndGuestTeam(Request $request)
    {

        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }

        $etickmatchtypeid = $request->param('etickmatchtype');

        $matchteam = MatchTeamModel::where('etickmatchtypeid', $etickmatchtypeid)->select();

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($matchteam));
    }

    public function AddAntiwaveFootballMatch(Request $request)
    {
//        matchtypeid:matchtypeid,
//                    hostteamid:hostteamid,
//                    guestteamid:guestteamid,
//                    matchcaption:matchcaption,
//                    scoreHole:scoreHole,
//                    scoreHalf:scoreHalf,
//                    scoreAngle:scoreAngle,
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }

        $matchtypeid = $request->param('matchtypeid');
        $hostteamid = $request->param('hostteamid');
        $guestteamid = $request->param('guestteamid');
        $matchcaption = $request->param('matchcaption');
        $matchtime = $request->param('matchtime');
        $displaytime = $request->param('displaytime');
        $disappeartime = $request->param('disappeartime');
        $scoreHole = $request->param('scoreHole');
        $scoreHalf = $request->param('scoreHalf');
        $scoreAngle = $request->param('scoreAngle');

        $hostmatchteam = MatchTeamModel::get($hostteamid);
        $guestmatchteam = MatchTeamModel::get($guestteamid);

        $hostmatchteamcaption = $hostmatchteam->caption;
        $guestmatchteamcaption = $guestmatchteam->caption;
        //新增比赛
        DatabaseApi::AddAntiwaveFootballMatch($matchtypeid, $hostteamid, $guestteamid, $matchcaption, $matchtime, $displaytime, $disappeartime);

        $sql = 'select * from etick_antiwave_football_match order by id desc limit 1';
        $match = Db::query($sql);
        $matchid = $match[0]['id'];

        $scoreHole = preg_replace('/_/', ':', $scoreHole);
        $arr_scorehole = json_decode($scoreHole);

        $scoreHalf = preg_replace('/_/', ':', $scoreHalf);
        $arr_scorehalf = json_decode($scoreHalf);

        $arr_scoreangle = json_decode($scoreAngle);
//        $arr = [
//'{"score":"3_0","theodds":"5%"}',
//'{"score":"3_1","theodds":"5%"}',
//'{"score":"3_2","theodds":"5%"}',
//'{"score":"3_3","theodds":"5%"}',
//'{"score":"2_3","theodds":"5%"}',
//'{"score":"2_2","theodds":"5%"}',
//'{"score":"2_1","theodds":"5%"}',
//'{"score":"2_0","theodds":"5%"}',
//'{"score":"1_3","theodds":"5%"}',
//'{"score":"1_2","theodds":"5%"}',
//'{"score":"1_1","theodds":"5%"}',
//'{"score":"1_0","theodds":"5%"}',
//'{"score":"0_3","theodds":"5%"}',
//'{"score":"0_2","theodds":"5%"}',
//'{"score":"0_1","theodds":"5%"}',
//'{"score":"0_0","theodds":"5%"}'
//];
//
//        $json_arr = json_encode($arr);
//
//        $a = json_decode($json_arr);

        if (is_array($arr_scorehole)) {
            foreach ($arr_scorehole as $scorehole) {
//                $arr_hole = json_decode($json_hole);
                $score = $scorehole->score;
                $theodds = $scorehole->theodds;
                $totaleti = $scorehole->totaleti;
                $frozeneti = $scorehole->frozeneti;

                $caption = $hostmatchteamcaption . ' VS ' . $guestmatchteamcaption;

                //新增竞猜
                DatabaseApi::AddAntiwaveFootballMatchCompetitionGuessing($matchid, $caption, 0, $score, $theodds, $totaleti, $frozeneti);
            }
        }

        if (is_array($arr_scorehalf)) {
            foreach ($arr_scorehalf as $scorehalf) {
                $score = $scorehalf->score;
                $theodds = $scorehalf->theodds;
                $totaleti = $scorehalf->totaleti;
                $frozeneti = $scorehalf->frozeneti;

                $caption = $hostmatchteamcaption . 'VS' . $guestmatchteamcaption;
                //新增竞猜
                DatabaseApi::AddAntiwaveFootballMatchCompetitionGuessing($matchid, $caption, 1, $score, $theodds, $totaleti, $frozeneti);
            }
        }

        if (is_array($arr_scoreangle)) {
            foreach ($arr_scoreangle as $scoreangle) {
                $score = $scoreangle->score;
                $theodds = $scoreangle->theodds;
                $totaleti = $scoreangle->totaleti;
                $frozeneti = $scoreangle->frozeneti;

                $caption = $hostmatchteamcaption . 'VS' . $guestmatchteamcaption;

                DatabaseApi::AddAntiwaveFootballMatchCompetitionGuessing($matchid, $caption, 2, $score, $theodds, $totaleti, $frozeneti);
            }
        }

        return StatusApi::ReturnJson('ERROR_STATUS_SUCCESS', '添加成功');
    }

    public function AddLolMatch(Request $request)
    {
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }

        $matchtypeid = $request->param('matchtypeid');
        $hostteamid = $request->param('hostteamid');
        $guestteamid = $request->param('guestteamid');
        $matchcaption = $request->param('matchcaption');
        $matchtime = $request->param('matchtime');
        $displaytime = $request->param('displaytime');
        $disappeartime = $request->param('disappeartime');
        $json_antiscore = $request->param('antiscore');
        $matchformat = $request->param('matchformat');

        $hostmatchteam = MatchTeamModel::get($hostteamid);
        $guestmatchteam = MatchTeamModel::get($guestteamid);

        $hostmatchteamcaption = $hostmatchteam->caption;
        $guestmatchteamcaption = $guestmatchteam->caption;
        //新增比赛
        DatabaseApi::AddLolMatch($matchtypeid, $hostteamid, $guestteamid, $matchcaption, $matchtime, $displaytime, $disappeartime, $matchformat);

        //找id
        $sql = 'select * from etick_antiwave_lol_match order by id desc limit 1';
        $match = Db::query($sql);
        $matchid = $match[0]['id'];

        $json_antiscore = preg_replace('/_/', ':', $json_antiscore);
        $arr_antiscore = json_decode($json_antiscore);

        if (is_array($arr_antiscore)) {
            foreach ($arr_antiscore as $antiscore) {
                $score = $antiscore->score;
                $theodds = $antiscore->theodds;
                $totaleti = $antiscore->totaleti;
                $frozeneti = $antiscore->frozeneti;

                $caption = $hostmatchteamcaption . ' VS ' . $guestmatchteamcaption . $score;

                //新增反积分竞猜
                DatabaseApi::AddAntiwaveLolmatchCompetitionGuessing($matchid, $caption, $score, $theodds, $totaleti, $frozeneti);
            }
        }
    }

    public function AddAntiwaveLolCompetitionGuessing(Request $request){
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }
        $systemTime = TimesApi::GetSystemTime();

        $matchid = $request->param('matchid');
        $json_antiscore = $request->param('antiscore');

        $json_antiscore = preg_replace('/_/', ':', $json_antiscore);
        $arr_antiscore = json_decode($json_antiscore);

        if (is_array($arr_antiscore)) {
            foreach ($arr_antiscore as $antiscore) {
                $score = $antiscore->score;
                $theodds = $antiscore->theodds;
                $totaleti = $antiscore->totaleti;
                $frozeneti = $antiscore->frozeneti;

                $caption = $score;

                //新增反积分竞猜
                DatabaseApi::AddAntiwaveLolmatchCompetitionGuessing($matchid, $caption, $score, $theodds, $totaleti, $frozeneti);
            }
        }
    }

    public function BalanceConfirmStartAntiwaveFootball(Request $request){
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }
        $matchid = $request->param('matchid');

        $match = AntiwaveFootballMatchModel::get($matchid);
        $match->status = 1;
        $match->statusinfo = '比赛开始';
        $match->allowField(true)->save();

        return StatusApi::ReturnJson('ERROR_STATUS_SUCCESS', '状态设置成功');

    }

    public function BalanceConfirmDelayAntiwaveFootball(Request $request){
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }
        $matchid = $request->param('matchid');

        $match = AntiwaveFootballMatchModel::get($matchid);
        $match->status = 2;
        $match->statusinfo = '比赛推迟';
        $match->allowField(true)->save();

        return StatusApi::ReturnJson('ERROR_STATUS_SUCCESS', '状态设置成功');

    }
    public function BalanceConfirmCancelAntiwaveFootball(Request $request){
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }
        $systemTime = TimesApi::GetSystemTime();

        $matchid = $request->param('matchid');


        $match = AntiwaveFootballMatchModel::get($matchid);
        $match->status = 3;
        $match->statusinfo = '比赛取消';
        $match->allowField(true)->save();

        //bettingrecord
        $sql = "update etick_betting_record set status = 2, statusinfo = '比赛取消' where matchid = '$matchid'";
        $result = Db::execute($sql);

        //etirecord
        $bettingrecords = BettingRecordModel::where('matchid', $matchid)->select();
        foreach($bettingrecords as $bettingrecord){
            $bettingrecordid = $bettingrecord->id;
            $userid = $bettingrecord->userid;
            DatabaseApi::AddEtiRecord($userid, 17, $bettingrecord->bettingeti, $systemTime);

            //user
            $user = UserModel::get($userid);
            $user->eti += $bettingrecords->bettingeti;
            $user->allowField(true)->save();
        }

        return StatusApi::ReturnJson('ERROR_STATUS_SUCCESS', '状态设置成功');


    }
    public function BalanceConfirmAntiwaveFootball(Request $request){
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }

        $systemTime = TimesApi::GetSystemTime();

        $matchid = $request->param('matchid');
        $balance_hole = $request->param('balance_hole');
        $balance_half = $request->param('balance_half');
        $balance_angle = $request->param('balance_angle');


        //match
        //结算足球
        $match = AntiwaveFootballMatchModel::get($matchid);
        $match->status = 4;
        $match->statusinfo = "结算成功";
        $match->score = $balance_hole;
        $match->firsthalfscore = $balance_half;
        $match->angle = $balance_angle;
        $match->total = (int)substr($balance_hole, 0, 1) + (int)substr($balance_hole, 2, 1);
        $match->allowField(true)->save();


        $isHitGuessing = false;
        $guessingOdds = 0;

        $readonlyguessings = AntiwaveFootballCompetitionGuessingModel::where('matchid', $matchid)->select();
        //compttition guessing
        foreach($readonlyguessings as $readonlyguessing){
            $guessing = AntiwaveFootballCompetitionGuessingModel::get($readonlyguessing->id);
            $guessingOdds = $guessing->theodds;

            if(($guessing->type === 0 && $guessing->score !== $balance_hole) ||
                ($guessing->type === 1 && $guessing->score !== $balance_half) ||
                ($guessing->type === 2 && $guessing->score !== $balance_angle)){
                //赢
                $guessing->status = 1;
                $guessing->statusinfo = '竞猜中奖';

                $isHitGuessing = true;
            }else if(($guessing->type === 0 && $guessing->score === $balance_hole) ||
                ($guessing->type === 1 && $guessing->score === $balance_half) ||
                ($guessing->type === 2 && $guessing->score === $balance_angle)){
                //输
                $guessing->status = 0;
                $guessing->statusinfo = '竞猜未中奖';

                $isHitGuessing = false;
            }
            $guessing->allowField(true)->save();
        }


        //betting record
        $readonlybettingrecords = BettingRecordModel::where('matchid', $matchid)->select(0);
        foreach($readonlybettingrecords as $readonlybettingrecord){
            $bettingrecord = BettingRecordModel::get($readonlybettingrecord->id);

            $bettingrecord->status = 1;
            $bettingrecord->statusinfo = '已结算';
            $bettingrecord->balancetime = $systemTime;

            $userid = $bettingrecord->userid;
            $user = UserModel::get($userid);

            $bettingeti = $bettingrecord->bettingeti;
            //中奖
            if($isHitGuessing){
                $interest = $bettingeti * $guessingOdds;
                $profit = $bettingeti + $interest;

                $bettingrecord->profit = $profit;
                $bettingrecord->bettingresult = 0;
                $bettingrecord->bettingresultinfo = '盈利';

                //eti recotd
                DatabaseApi::AddEtiRecord($userid, 2, $profit, $systemTime);

                //user
                $user->eti += $profit;
                $user->save();

                //推荐人
                if($user->rankpre !== 'admin'){
                    $rankpreuser = UserModel::where('uuid', $user->rankpre)->find();
                    if(!empty($rankpreuser)){
                        //一代10%
                        $rankpreuser->eti += $interest * 0.1;
                        //团队
                        $rankpreuser->eti += $interest * $this->GetTeamProfitByTeamCount($rankpreuser->teamcount);

                        $rankpreuser->save();
                    }

                }

            }else{ //未中奖

                $bettingrecord->status = 1;
                $bettingrecord->statusinfo = '已结算';
                $bettingrecord->balancetime = $systemTime;

                $bettingrecord->bettingresult = 1;
                $bettingrecord->bettingresultinfo = '亏损';
            }
            $bettingrecord->allowField(true)->save();
        }

        return StatusApi::ReturnJson('ERROR_STATUS_SUCCESS', '结算成功');

    }

    private function GetTeamProfitByTeamCount($teamcount){
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }

        $teamprofits = TeamProfitModel::all();
        foreach($teamprofits as $teamprofit){
            if($teamcount <= $teamprofit->teamcount){
                return $teamprofit->profitrate;
            }
        }
        return 0.1;
    }

    public function BalanceConfirmStartLol(Request $request){
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }


        $matchid = $request->param('matchid');

        $match = LolMatchModel::get($matchid);
        $match->status = 1;
        $match->statusinfo = '比赛开始';
        $match->allowField(true)->save();

    }
    public function BalanceConfirmCancelLol(Request $request){
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }
        $systemTime = TimesApi::GetSystemTime();

        $matchid = $request->param('matchid');


        $match = LolMatchModel::get($matchid);
        $match->status = 3;
        $match->statusinfo = '比赛取消';
        $match->allowField(true)->save();

        //bettingrecord
        $sql = "update etick_betting_record set status = 2, statusinfo = '比赛取消' where matchid = '$matchid'";
        $result = Db::execute($sql);

        //etirecord
        $bettingrecords = BettingRecordModel::where('matchid', $matchid)->select();
        foreach($bettingrecords as $bettingrecord){
            $userid = $bettingrecord->userid;
            DatabaseApi::AddEtiRecord($userid, 17, $bettingrecord->bettingeti, $systemTime);

            //user
            $user = UserModel::get($userid);
            $user->eti += $bettingrecords->bettingeti;
            $user->allowField(true)->save();
        }
    }
    public function  BalanceConfirmDelayLol(Request $request){
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }
        $matchid = $request->param('matchid');

        $match = LolMatchModel::get($matchid);
        $match->status = 2;
        $match->statusinfo = '比赛推迟';
        $match->allowField(true)->save();

    }

    public function BalanceConfirmLol(Request $request){
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }
        $systemTime = TimesApi::GetSystemTime();

        $matchid = $request->param('matchid');
        $balance_lol_score = $request->param('balance_lol_score');

        //match
        //结算英雄联盟
        $match = LolMatchModel::get($matchid);
        $match->status = 4;
        $match->statusinfo = "结算成功";
        $match->allowField(true)->save();


        $isHitGuessing = false;
        $guessingOdds = 0;

        $readonlyguessings = LolCompetitionGuessingModel::where('matchid', $matchid)->select();
        //compttition guessing
        foreach($readonlyguessings as $readonlyguessing){
            $guessing = LolCompetitionGuessingModel::get($readonlyguessing->id);
            $guessingOdds = $guessing->theodds;

            if(($guessing->type === 8 && $guessing->score !== $balance_lol_score)){
                //赢
                $guessing->status = 1;
                $guessing->statusinfo = '竞猜中奖';

                $isHitGuessing = true;
            }else if(($guessing->type === 8 && $guessing->score === $balance_lol_score)){
                //输
                $guessing->status = 0;
                $guessing->statusinfo = '竞猜未中奖';

                $isHitGuessing = false;
            }
            $guessing->allowField(true)->save();
        }


        //betting record
        $readonlybettingrecords = BettinRecordModel::where('matchid', $matchid)->select();
        foreach($readonlybettingrecords as $readonlybettingrecord){
            $bettingrecord = BettingRecordModel::get($readonlybettingrecord->id);

            $bettingrecord->status = 1;
            $bettingrecord->statusinfo = '已结算';
            $bettingrecord->balancetime = $systemTime;

            $userid = $bettingrecord->userid;
            $user = UserModel::get($userid);

            $bettingeti = $bettingrecord->bettingeti;
            //中奖
            if($isHitGuessing){
                $interest = $bettingeti * $guessingOdds;
                $profit = $bettingeti + $interest;

                $bettingrecord->profit = $profit;
                $bettingrecord->bettingresult = 0;
                $bettingrecord->bettingresultinfo = '盈利';

                //eti record
                DatabaseApi::AddEtiRecord($userid, 2, $profit, $systemTime);

                //user
                $user->eti += $profit;
                $user->save();

                //推荐人
                if($user->rankpre !== 'admin'){
                    $rankpreuser = UserModel::where('uuid', $user->rankpre)->find();
                    if(!empty($rankpreuser)){
                        //一代10%
                        $rankpreuser->eti += $interest * 0.1;
                        //团队
                        $rankpreuser->eti += $interest * $this->GetTeamProfitByTeamCount($rankpreuser->teamcount);

                        $rankpreuser->save();
                    }

                }

            }else{ //未中奖

                $bettingrecord->bettingresult = 1;
                $bettingrecord->bettingresultinfo = '亏损';
            }
            $bettingrecord->allowField(true)->save();
        }
    }

    public function GetAntiwaveFootballMatchStatus(Request $request){
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }
        $matchid = $request->param('matchid');

        $match = AntiwaveFootballMatchModel::get($matchid);
        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', $match->status);
    }
    public function GetLolMatchStatus(Request $request){
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }
        $matchid = $request->param('matchid');

        $match = LolMatchModel::get($matchid);
        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', $match->status);

    }

}
