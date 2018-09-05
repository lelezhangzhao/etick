<?php

namespace app\etick\controller;

use app\etick\api\Status as StatusApi;
use app\etick\api\Times as TimesApi;
use app\etick\api\UserStatus as UserStatusApi;
use app\etick\api\Database as DatabaseApi;

use think\Controller;
use think\Session;
use think\Request;

use app\etick\model\AntiwaveLolCompetitionGuessing as AntiwaveLolCompetitionGuessingModel;


class AntiwaveLolCompetitionGuessing extends Controller{
    public function BettingCompetitionGuessing(Request $request){
        //用户状态
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        $systemTime = TimesApi::GetSystemTime();

        //获取参数
        $matchid = $request->param('matchid');
        $guessingid = $request->param('guessingid');
        $eti = $request->param('eti');
        $userid = Session::get('userid');


        $user = UserModel::get($userid);
        if(empty($user)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_USERISNOTEXIST');
        }

        $match = AntiwaveLolMatchModel::get($matchid);
        if(empty($match)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_NOMATCHMATCH');
        }

        $guessing = AntiwaveLolCompetitionGuessingModel::get($guessingid);
        if(empty($guessing)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_COMPETITIONGUESSINGISNOTEXIST');
        }

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

        //改变竞猜剩余额度
        Db::startTrans(); //启动事务
        try {
            $transGuessing = Db::name('AntiwaveLolCompetitionGuessing')->lock(true)->where('id', $guessingid)->find();
            if(empty($transGuessing)){
                throw(new \PDOException('ERROR_STATUS_COMPETITIONGUESSINGISNOTEXIST'));
            }
            if($transGuessing['remaineti'] > $eti){
                $transGuessing['remaineti'] -= $eti;
                Db::name('AntiwaveLolCompetitionGuessing')->update($transGuessing);
            }else{
                throw(new \PDOException('ERROR_STATUS_GUESSINGREMAINETINOTENOUGH'));
            }
            Db::commit(); //提交事务
        } catch (\PDOException $e) {
            Db::rollback(); //回滚事务
            return StatusApi::ReturnErrorStatus($e->getMessage());
        }


//        $guessing->remaineti -= $eti;
//        $guessing->allowField(true)->save();

        //改变用户额度
        $user->eti -= $eti;
        $user->allowField(true)->save();

        //插入etirecord
        DatabaseApi::AddEtiRecord($userid, 1, -$eti, $systemTime);

        //插入bettingrecord
        DatabaseApi::AddBettingRecord($userid, 3, 0, $matchid, $guessingid, $eti, 0);
        return StatusApi::ReturnJson('ERROR_STATUS_SUCCESS', '下注成功');

    }
}