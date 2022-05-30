let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd ~/program/node/raptorTrading
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
let s:shortmess_save = &shortmess
set shortmess=aoO
badd +5 bots/helper.ts
badd +45 index.ts
badd +129 bots/stab/stabBot.ts
badd +3 bots/stab/botSecret.ts
badd +2 bots/stab/stabBot_realtimeSim.ts
badd +150 bots/stab/stabBotSim_waiter.ts
badd +35 controller/wazirx/WazirxTransaction.ts
badd +141 wazirx/transactions.ts
badd +25 controller/Transactions.ts
badd +70 controller/fund/fund.ts
badd +76 controller/FundTransfer.ts
badd +146 bots/stopLoss/stopLossBot.ts
badd +116 Utility.ts
badd +1 bots/bots.ts
badd +2 wazirx/request.ts
badd +79 controller/Coins.ts
badd +6 controller/coins/utility.ts
badd +33 models/UserModel.ts
badd +24 models/TransactionModel.ts
badd +5 models/DonationModel.ts
badd +6 auth.ts
badd +1 controller/wazirx/StopLossBot.ts
badd +17 routes/Wazirx.ts
badd +31 models/bots/StopLossModel.ts
badd +34 controller/transactions/trans.ts
badd +9 wazirx/api.ts
badd +10 tests/bot/test.js
badd +5 tests/api.js
badd +1 models/wazirx/LockedAssetModel.ts
badd +6 models/wazirx/WazirxTransactionModel.ts
badd +1 controller/User.ts
badd +14 controller/users/Users.ts
badd +11 routes/Coins.ts
badd +4 db/db.ts
badd +1 models/CoinModel.ts
badd +13 tests/coinTest.js
badd +18 routes/User.ts
badd +10 tests/userTest.js
badd +21 models/FundTransferModel.ts
badd +16 routes/FundTransfer.ts
badd +12 tests/FundTest.js
badd +19 tests/coinPurchaseTest.js
badd +16 routes/Transaction.ts
badd +125 tools/recoverData.js
badd +4 wazirx/tests/ordertest.js
badd +1 wazirx/helper.ts
badd +1 bots/stab/stabConfig.ts
badd +45 tools/DelistCoin.ts
badd +11 tools/UserPassword.ts
argglobal
%argdel
$argadd index.ts
edit tools/DelistCoin.ts
argglobal
balt models/UserModel.ts
let s:l = 45 - ((25 * winheight(0) + 22) / 45)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 45
normal! 055|
lcd ~/program/node/raptorTrading
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
let &shortmess = s:shortmess_save
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
set hlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
