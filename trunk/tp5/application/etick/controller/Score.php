<?php
namespace app\etick\controller;

use app\etick\api\UserStatus;
use think\Controller;

use think\Session;
use think\Request;
use think\Db;

use app\etick\api\Database as DatabaseApi;
use app\etick\api\Status as StatusApi;
use app\etick\api\Times as TimesApi;
use app\etick\api\UserStatus as UserStatusApi;
use app\etick\api\Util as UtilApi;

use app\etick\model\User as UserModel;
use app\etick\model\EntrustmentPurchase as EntrustmentPurchaseModel;
use app\etick\model\DirectPurchase as DirectPurchaseModel;

class Score extends Controller{
    public function Index(){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        return $this->fetch();
    }


    //我的交易
    public function GetPurchaseRecord(){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        $userid = Session::get('userid');

        //挂单
        $entrustmentPurchase = EntrustmentPurchaseModel::where('userid', $userid)->select();
        //直接
        $directPurchase = DirectPurchaseModel::where('userid', $userid)->select();

        //可操作挂单项
        $entrustmentOperatable = Db::view('DirectPurchase', 'id, status')
            ->where('DirectPurchase.status', 'in', '0,1')
            ->view('EntrustmentPurchase', 'userid', 'EntrustmentPurchase.id = DirectPurchase.entrustmentid')
            ->where('EntrustmentPurchase.userid', $userid)
            ->select();
//        $entrustmentOperatable = Db::name('direct_purchase')->select();


        $purchaserecord = ['entrustmentpurchase' => $entrustmentPurchase, 'directpurchase' => $directPurchase, '$entrustmentoperatable' => $entrustmentOperatable];

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', $purchaserecord);
    }

    //挂单详情
    public function GetEntrustmentDetail(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        $ordernumber = $request->param('ordernumber');
        $userid = Session::get('userid');

        $entrustmentPurchase = EntrustmentPurchaseModel::where('ordernumber', $ordernumber)->find();
        if(empty($entrustmentPurchase)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PURCHASEISNOTEXIST');
        }else if($entrustmentPurchase->userid !== $userid){
            UserStatusApi::FrozenUser('获取不是自己的挂单详情');
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_HACKER');
        }
        $detailRecord = DirectPurchaseModel::where('entrustmentid', $entrustmentPurchase->id)->select();
        if(empty($detailRecord)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PURCHASEISNOTEXIST');
        }

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', $detailRecord);
    }

    //获取卖方银行账户
    public function GetSalingUserAccount(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        $directOrderNumber = $request->param('ordernumber');
        $userid = Session::get('userid');

        $detailRecord = DirectPurchaseModel::where('ordernumber', $directOrderNumber)->find();
        if(empty($detailRecord)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PURCHASEISNOTEXIST');
        }

        if($detailRecord->status !== 0 && $detailRecord->status !== 1){
            UserStatusApi::FrozenUser('获取不是未完成交易用户信息');
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_HACKER');
        }

        $entrustmentPurchase = EntrustmentPurchaseModel::get($detailRecord->entrustmentid);
        if(empty($entrustmentPurchase)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PURCHASEISNOTEXIST');
        }

        $userforsaling = null;
        //买方未完成交易，获取对方银行信息
        if($detailRecord->userid === $userid && $detailRecord->purchasetype === 0){
            //直接买交易未完成，显示卖方信息
            $userforsaling = Db::name('User', 'name, tel, banknum, bankname, alipaynum')->where('id', $entrustmentPurchase->userid)->find();
        }else if($detailRecord->userid !== $userid && $detailRecord->purchasetype === 1){
            //挂买交易未完成，显示卖方信息
            $userforbuying = UserModel::get($entrustmentPurchase->userid);
            if($userforbuying !== $userid){
                UserStatusApi::FrozenUser('获取挂买方不是自己的卖方信息');
                return StatusApi::ReturnErrorStatus('ERROR_STATUS_HACKER');
            }
            $userforsaling = Db::name('User', 'name, tel, banknum, bankname, alipaynum')->where('id', $detailRecord->userid)->find();
        }
        if(empty($userforsaling)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_USERISNOTEXIST');
        }


        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', $userforsaling);
    }
    //挂单可买入记录
    public function GetEntrustmentBuyingEtiRecord(){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        $record = EntrustmentPurchaseModel::where('purchasetype', 0)
            ->where('status', 0)
            ->select();

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', $record);
    }

    //挂单可卖出记录
    public function GetEntrustmentSalingEtiRecord(){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        $record = EntrustmentPurchaseModel::where('purchasetype', 1)
            ->where('status', 0)
            ->select();

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', $record);
    }

    //挂单买
    public function EntrustmentBuyingEti(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        $eticount = $request->param('eticount');
        $mineti = $request->param('mineti');
        $maxeti = $request->param('maxeti');
        $rmbpereti = $request->param('rmbpereti');
        $userid = Session::get('userid');

        //上大盘
        DatabaseApi::AddEntrustmentPurchase($userid, $eticount, $rmbpereti, $mineti, $maxeti, 0);
        return StatusApi::ReturnErrorStatus('ERROR_STATUS_SUCCESS');
    }

    //挂买方打款
    public function EntrustmentBuyingPurchase(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        $systemTime = TimesApi::GetSystemTime();

        $directOrderNubmer = $request->param('ordernumber');
        $userid = Session::get('userid');

        $directPurchase = DirectPurchaseModel::where($directOrderNubmer)->find();
        if(empty($directPurchase)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PURCHASEISNOTEXIST');
        }
        $entrustmentPurchase = EntrustmentPurchaseModel::get($directPurchase->entrustmentid);
        if(empty($entrustmentPurchase)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PURCHASEISNOTEXIST');
        }else if($entrustmentPurchase->userid !== $userid){
            UserStatusApi::FrozenUser('挂买打款不是自己的交易单');
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_HACK');
        }

        //修改directpurchase状态
        $directPurchase->status = 1;
        $directPurchase->statusinfo = '已打款，等待确认';
        $directPurchase->paytime = $systemTime;
        $directPurchase->allowField(true)->save();

    }

    //挂单卖
    public function EntrustmentSalingEti(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        $eticount = $request->param('eticount');
        $mineti = $request->param('mineti');
        $maxeti = $request->param('maxeti');
        $rmbpereti = $request->param('rmbpereti');
        $userid = Session::get('userid');


        //可用ETI够不够
        $user = UserModel::get($userid);
        if($user->eti < $eticount){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_ETIISNOTENOUGH');
        }

        //减去ETI
        $user->eti -= $eticount;
        $user->etiforsaling += $eticount;
        $user->allowField(true)->save();

        //上大盘
        DatabaseApi::AddEntrustmentPurchase($userid, $eticount, $rmbpereti, $mineti, $maxeti, 1);
        return StatusApi::ReturnErrorStatus('ERROR_STATUS_SUCCESS');
    }

    //挂卖方确认
    public function EntrustmentSalingConfirm(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        $systemTime = TimesApi::GetSystemTime();
        $directOrderNumber = $request->param('ordernumber');
        $userid = Session::get('userid');

        $directPurchase = DirectPurchaseModel::where('ordernumber', $directOrderNumber)->find();
        if(empty($directPurchase)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PURCHASEISNOTEXIST');
        }
        $entrustmentPurchase = EntrustmentPurchaseModel::get($directPurchase->entrustmentid);
        if($entrustmentPurchase->userid !== $userid){
            UserStatusApi::FrozenUser('挂卖确认不是自己的交易单');
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_HACK');
        }

        $eti = $directPurchase->eti;
        //user etiforsaling
        $user = UserModel::get($userid);
        $user->etiforsaling -= $eti;
        $user->allowField(true)->save();

        //积分转出状态改变
        $directPurchase->status = 2;
        $directPurchase->statusinfo = '交易完成';
        $directPurchase->confirmtime = $systemTime;
        $directPurchase->allowField(true)->save();

        //买方获得eti
        $userforbuying = UserModel::get($directOrderNumber->userid);
        $userforbuying->eti += $directPurchase->eti;
        $userforbuying->allowField(true)->save();

        //eti record
        DatabaseApi::AddEtiRecord($userid, 11, -$eti);
        DatabaseApi::AddEtiRecord($directPurchase->userid, 10, $eti);

        return StatusApi::ReturnJson('ERROR_STATUS_SECCESS', '交易成功');
    }


    //直接买锁定
    public function DirectBuyingLock(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        $entrustmentOrderNumber = $request->param('ordernumber');
        $eticount = $request->param('eticount');
        $userid = Session::get('userid');
        $entrustmentPurchase = EntrustmentPurchaseModel::where('ordernumber', $entrustmentOrderNumber)->find();
        if(empty($entrustmentPurchase)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PURCHASEISNOTEXIST');
        }
        if($entrustmentPurchase->mineti > $eticount || $entrustmentPurchase->maxeti < $eticount){
            UserStatusApi::FrozenUser('后台接收到错误交易额度');
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_HACKER');
        }

        //事务
        //挂单余额够
        Db::startTrans(); //启动事务
        try {
            $transEntrustmentPurchase = Db::name('EntrustmentPurchase')->lock(true)->where('ordernumber', $entrustmentOrderNumber)->find();
            if(empty($transEntrustmentPurchase)){
                throw(new \PDOException('ERROR_STATUS_PURCHASEISNOTEXIST'));
            }
            if($transEntrustmentPurchase['remaineti'] > $eticount){
                $transEntrustmentPurchase['remaineti'] -= $eticount;
                Db::name('EntrustmentPurchase')->update($transEntrustmentPurchase);
            }else{
                throw(new \PDOException('ERROR_STATUS_PURCHASEREMAINETIISNOTENOUGH'));
            }
            Db::commit(); //提交事务
        } catch (\PDOException $e) {
            Db::rollback(); //回滚事务
            return StatusApi::ReturnErrorStatus($e->getMessage());
        }


        //增加direct purchase
        DatabaseApi::AddDirectPurchase($userid, $entrustmentPurchase.id, $eticount, $entrustmentPurchase->rmbpereti, 0);

    }

    //直接买打款
    public function DirectBuyingPurchase(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        $systemTime = TimesApi::GetSystemTime();

        $directOrderNumber = $request->param('ordernumber');
        $proofone = $request->param('proofone');
        $prooftwo = $request->param('prooftwo');
        $proofthree = $request->param('proofthree');
        $userid = Session::get('userid');

        $directPurchase = DirectPurchaseModel::where('ordernumber', $directOrderNumber)->find();
        if(empty($directPurchase)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PURCHASEISNOTEXIST');
        }else if($directPurchase->userid !== $userid){
            UserStatusApi::FrozenUser('直接买打款不是自己的交易单');
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_HACK');
        }

        //改变状态
        $directPurchase->paytime = $systemTime;
        $directPurchase->proofone = $proofone;
        $directPurchase->prooftwo = $prooftwo;
        $directPurchase->proofthree = $proofthree;
        $directPurchase->status = 1;
        $directPurchase->statusinfo = '已打款，等待确认';
        $directPurchase->allowField(true)->save();

        return StatusApi::ReturnJson('ERROR_STATUS_SUCCESS', '已打款，耐心等待对方确认！');
    }


    //直接卖锁定
    public function DirectSaling(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        $systemTime = TimesApi::GetSystemTime();

        $entrustmentOrderNumber = $request->param('entrustmentordernumber');
        $eti = $request->param('eti');
        $userid = Session::get('userid');

        //自己eti够
        $user = UserModel::get('userid');
        if($user->eti < $eti){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_ETIISNOTENOUGH');
        }


        //交易单eti有剩余，且交易eti在区间内
        $entrustmentPurchase = EntrustmentPurchaseModel::where('ordernumber', $entrustmentOrderNumber)->find();
        if(empty($entrustmentPurchase)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PURCHASEISNOTEXIST');
        }else if($entrustmentPurchase->mineti > $eti || $entrustmentPurchase->maxeti < $eti){
            UserStatusApi::FrozenUser('后台接收到错误交易额度');
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_HACKER');
        }

        //事务修改交易单
        Db::startTrans(); //启动事务
        try {
            $transEntrustmentPurchase = Db::name('EntrustmentPurchase')->lock(true)->where('ordernumber', $entrustmentOrderNumber)->find();
            if(empty($transEntrustmentPurchase)){
                throw(new \PDOException('ERROR_STATUS_PURCHASEISNOTEXIST'));
            }
            if($transEntrustmentPurchase['remaineti'] > $eti){
                $transEntrustmentPurchase['remaineti'] -= $eti;
                Db::name('EntrustmentPurchase')->update($transEntrustmentPurchase);
            }else{
                throw(new \PDOException('ERROR_STATUS_PURCHASEREMAINETIISNOTENOUGH'));
            }
            Db::commit(); //提交事务
        } catch (\PDOException $e) {
            Db::rollback(); //回滚事务
            return StatusApi::ReturnErrorStatus($e->getMessage());
        }


        //修改自己eti
        $user->eti -= $eti;
        $user->etiforsaling += $eti;
        $user->allowField(true)->save();

        //上大盘
        DatabaseApi::AddDirectPurchase($userid, $entrustmentPurchase->id, $eti, $entrustmentPurchase->rmbpereti, 1);

        return StatusApi::ReturnJson('ERROR_STATUS_SUCCESS', '锁定成功，等待对方打款');

    }

    //直接卖确认
    public function DirectSalingConfirm(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        $systemTime = TimesApi::GetSystemTime();
        $directOrderNumber = $request->param('ordernumber');
        $userid = Session::get('userid');

        $directPurchase = DirectPurchaseModel::where('ordernumber', $directOrderNumber)->find();
        if(empty($directPurchase)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PURCHASEISNOTEXIST');
        }else if($directPurchase->userid !== $userid){
            UserStatusApi::FrozenUser('直接卖确认不是自己的交易单');
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_HACK');
        }

        $eti = $directPurchase->eti;
        //user etiforsaling
        $user = UserModel::get($userid);
        $user->etiforsaling -= $eti;
        $user->allowField(true)->save();

        //积分转出状态改变
        $directPurchase->status = 2;
        $directPurchase->statusinfo = '交易完成';
        $directPurchase->confirmtime = $systemTime;
        $directPurchase->allowField(true)->save();

        //挂买方获得eti
        $entrustmentPurchase = EntrustmentPurchaseModel::get($directPurchase->entrustmentid);

        $userforbuying = UserModel::get($entrustmentPurchase->userid);
        $userforbuying->eti += $directPurchase->eti;
        $userforbuying->allowField(true)->save();


        //eti record
        DatabaseApi::AddEtiRecord($userid, 11, -$eti);
        DatabaseApi::AddEtiRecord($directPurchase->userid, 10, $eti);

        return StatusApi::ReturnJson('ERROR_STATUS_SECCESS', '交易成功');

    }

    public function UploadProof(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        $directOrderNumber = $request->param('ordernumber');
        $proofOne = $request->param('proofone');
        $proofTwo = $request->param('prooftwo');
        $proofThree = $request->param('proofthree');
        $userid = Session::get('userid');

        //只有买家未完成交易，才可以上传凭证
        $directPurchase = DirectPurchaseModel::where('ordernumber', $directOrderNumber)->find();
        if(empty($directPurchase)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PURCHASEISNOTEXIST');
        }

        if($directPurchase->status !== 0 && $directPurchase->status !== 1){
            UserStatusApi::FrozenUser('获取不是未完成交易用户信息');
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_HACKER');
        }

        $entrustmentPurchase = EntrustmentPurchaseModel::get($directPurchase->entrustmentid);
        if(empty($entrustmentPurchase)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PURCHASEISNOTEXIST');
        }

        $couldUploadProof = false;
        //买方未完成交易，可以上传凭证
        if($directPurchase->userid === $userid && $directPurchase->purchasetype === 0){
            //直接买交易未完成，可以上传凭证
            $couldUploadProof = true;
        }else if($directPurchase->userid !== $userid && $directPurchase->purchasetype === 1){
            //挂买交易未完成，可以上传凭证
            $userforbuying = UserModel::get($entrustmentPurchase->userid);
            if($userforbuying !== $userid){
                UserStatusApi::FrozenUser('挂买方不是自己，要上传挂买凭证');
                return StatusApi::ReturnErrorStatus('ERROR_STATUS_HACKER');
            }
            $couldUploadProof = true;
        }
        if(!$couldUploadProof){
            UserStatusApi::FrozenUser('没权限上传凭证');
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_HACKER');
        }

        $directPurchase->proofone = $proofOne;
        $directPurchase->prooftwo = $proofTwo;
        $directPurchase->proofThree = $proofThree;
        $directPurchase->allowField(true)->save();

        return StatusApi::ReturnErrorStatus('ERROR_STATUS_PROOFUPLOADSUCCESS');
    }
}