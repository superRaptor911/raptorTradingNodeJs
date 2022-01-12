let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd ~/program/node/raptorTrading
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
argglobal
%argdel
$argadd index.js
edit controller/wazirx/trans.js
argglobal
balt wazirx/api.js
let s:l = 150 - ((40 * winheight(0) + 22) / 45)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 150
normal! 0
lcd ~/program/node/raptorTrading
tabnext 1
badd +10 ~/program/node/raptorTrading/tests/bot/test.js
badd +1 ~/program/node/raptorTrading/index.js
badd +126 ~/program/node/raptorTrading/tests/api.js
badd +105 ~/program/node/raptorTrading/controller/wazirx/WazirxTransaction.js
badd +67 ~/program/node/raptorTrading/wazirx/api.js
badd +10 ~/program/node/raptorTrading/controller/wazirx/trans.js
badd +100 ~/program/node/raptorTrading/wazirx/request.js
badd +11 ~/program/node/raptorTrading/routes/Wazirx.js
badd +23 ~/program/node/raptorTrading/controller/transactions/trans.js
badd +10 ~/program/node/raptorTrading/models/wazirx/LockedAssetModel.js
badd +6 ~/program/node/raptorTrading/models/wazirx/WazirxTransactionModel.js
badd +27 ~/program/node/raptorTrading/tools/UserPassword.js
badd +11 ~/program/node/raptorTrading/controller/User.js
badd +5 ~/program/node/raptorTrading/controller/users/Users.js
badd +9 ~/program/node/raptorTrading/routes/Coins.js
badd +51 ~/program/node/raptorTrading/controller/Coins.js
badd +8 ~/program/node/raptorTrading/db/db.js
badd +4 ~/program/node/raptorTrading/models/CoinModel.js
badd +13 ~/program/node/raptorTrading/tests/coinTest.js
badd +8 ~/program/node/raptorTrading/controller/coins/utility.js
badd +17 ~/program/node/raptorTrading/models/UserModel.js
badd +12 ~/program/node/raptorTrading/routes/User.js
badd +10 ~/program/node/raptorTrading/tests/userTest.js
badd +8 ~/program/node/raptorTrading/models/FundTransferModel.js
badd +16 ~/program/node/raptorTrading/controller/FundTransfer.js
badd +1 ~/program/node/raptorTrading/routes/FundTransfer.js
badd +53 ~/program/node/raptorTrading/controller/fund/fund.js
badd +7 ~/program/node/raptorTrading/models/TransactionModel.js
badd +31 ~/program/node/raptorTrading/controller/Transactions.js
badd +12 ~/program/node/raptorTrading/tests/FundTest.js
badd +95 ~/program/node/raptorTrading/Utility.js
badd +19 ~/program/node/raptorTrading/tests/coinPurchaseTest.js
badd +11 ~/program/node/raptorTrading/routes/Transaction.js
badd +125 ~/program/node/raptorTrading/tools/recoverData.js
badd +6 ~/program/node/raptorTrading/models/DonationModel.js
badd +4 ~/program/node/raptorTrading/wazirx/tests/ordertest.js
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 shortmess=filnxtToOFc
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
set hlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
