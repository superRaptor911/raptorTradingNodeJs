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
$argadd index.ts
edit wazirx/request.ts
argglobal
balt Utility.ts
let s:l = 2 - ((1 * winheight(0) + 22) / 45)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 2
normal! 024|
lcd ~/program/node/raptorTrading
tabnext 1
badd +5 ~/program/node/raptorTrading/index.ts
badd +6 ~/program/node/raptorTrading/bots/bots.ts
badd +259 ~/program/node/raptorTrading/controller/wazirx/trans.ts
badd +1 ~/program/node/raptorTrading/controller/Coins.ts
badd +3 ~/program/node/raptorTrading/controller/coins/utility.ts
badd +33 ~/program/node/raptorTrading/models/UserModel.ts
badd +24 ~/program/node/raptorTrading/models/TransactionModel.ts
badd +3 ~/program/node/raptorTrading/Utility.ts
badd +61 ~/program/node/raptorTrading/controller/fund/fund.ts
badd +5 ~/program/node/raptorTrading/models/DonationModel.ts
badd +1 ~/program/node/raptorTrading/auth.ts
badd +52 ~/program/node/raptorTrading/bots/stopLoss/stopLossBot.ts
badd +1 ~/program/node/raptorTrading/controller/wazirx/StopLossBot.ts
badd +26 ~/program/node/raptorTrading/routes/Wazirx.ts
badd +11 ~/program/node/raptorTrading/models/bots/StopLossModel.ts
badd +11 ~/program/node/raptorTrading/controller/transactions/trans.ts
badd +33 ~/program/node/raptorTrading/wazirx/api.ts
badd +10 ~/program/node/raptorTrading/tests/bot/test.js
badd +5 ~/program/node/raptorTrading/tests/api.js
badd +101 ~/program/node/raptorTrading/controller/wazirx/WazirxTransaction.ts
badd +2 ~/program/node/raptorTrading/wazirx/request.ts
badd +1 ~/program/node/raptorTrading/models/wazirx/LockedAssetModel.ts
badd +20 ~/program/node/raptorTrading/models/wazirx/WazirxTransactionModel.ts
badd +27 ~/program/node/raptorTrading/tools/UserPassword.js
badd +1 ~/program/node/raptorTrading/controller/User.ts
badd +14 ~/program/node/raptorTrading/controller/users/Users.ts
badd +10 ~/program/node/raptorTrading/routes/Coins.ts
badd +4 ~/program/node/raptorTrading/db/db.ts
badd +1 ~/program/node/raptorTrading/models/CoinModel.ts
badd +13 ~/program/node/raptorTrading/tests/coinTest.js
badd +18 ~/program/node/raptorTrading/routes/User.ts
badd +10 ~/program/node/raptorTrading/tests/userTest.js
badd +21 ~/program/node/raptorTrading/models/FundTransferModel.ts
badd +6 ~/program/node/raptorTrading/controller/FundTransfer.ts
badd +16 ~/program/node/raptorTrading/routes/FundTransfer.ts
badd +55 ~/program/node/raptorTrading/controller/Transactions.ts
badd +12 ~/program/node/raptorTrading/tests/FundTest.js
badd +19 ~/program/node/raptorTrading/tests/coinPurchaseTest.js
badd +16 ~/program/node/raptorTrading/routes/Transaction.ts
badd +125 ~/program/node/raptorTrading/tools/recoverData.js
badd +4 ~/program/node/raptorTrading/wazirx/tests/ordertest.js
badd +4 ~/.config/nvim/UltiSnips/typescript.snippets
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
