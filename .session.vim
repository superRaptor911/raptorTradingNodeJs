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
edit controller/wazirx/WazirxTransaction.js
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
let &splitbelow = s:save_splitbelow
let &splitright = s:save_splitright
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 87 + 87) / 174)
exe 'vert 2resize ' . ((&columns * 86 + 87) / 174)
argglobal
balt controller/wazirx/trans.js
let s:l = 66 - ((21 * winheight(0) + 22) / 45)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 66
normal! 023|
lcd ~/program/node/raptorTrading
wincmd w
argglobal
if bufexists("~/program/node/raptorTrading/models/wazirx/LockedAssetModel.js") | buffer ~/program/node/raptorTrading/models/wazirx/LockedAssetModel.js | else | edit ~/program/node/raptorTrading/models/wazirx/LockedAssetModel.js | endif
if &buftype ==# 'terminal'
  silent file ~/program/node/raptorTrading/models/wazirx/LockedAssetModel.js
endif
balt ~/program/node/raptorTrading/models/wazirx/WazirxTransactionModel.js
let s:l = 10 - ((9 * winheight(0) + 22) / 45)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 10
normal! 017|
lcd ~/program/node/raptorTrading
wincmd w
exe 'vert 1resize ' . ((&columns * 87 + 87) / 174)
exe 'vert 2resize ' . ((&columns * 86 + 87) / 174)
tabnext 1
badd +27 ~/program/node/raptorTrading/tools/UserPassword.js
badd +56 ~/program/node/raptorTrading/index.js
badd +11 ~/program/node/raptorTrading/controller/User.js
badd +5 ~/program/node/raptorTrading/controller/users/Users.js
badd +6 ~/program/node/raptorTrading/models/wazirx/WazirxTransactionModel.js
badd +1 ~/program/node/raptorTrading/wazirx/request.js
badd +1 ~/program/node/raptorTrading/routes/Coins.js
badd +58 ~/program/node/raptorTrading/controller/Coins.js
badd +8 ~/program/node/raptorTrading/db/db.js
badd +4 ~/program/node/raptorTrading/models/CoinModel.js
badd +13 ~/program/node/raptorTrading/tests/coinTest.js
badd +3 ~/program/node/raptorTrading/controller/coins/utility.js
badd +9 ~/program/node/raptorTrading/models/UserModel.js
badd +12 ~/program/node/raptorTrading/routes/User.js
badd +10 ~/program/node/raptorTrading/tests/userTest.js
badd +8 ~/program/node/raptorTrading/models/FundTransferModel.js
badd +16 ~/program/node/raptorTrading/controller/FundTransfer.js
badd +1 ~/program/node/raptorTrading/routes/FundTransfer.js
badd +53 ~/program/node/raptorTrading/controller/fund/fund.js
badd +7 ~/program/node/raptorTrading/models/TransactionModel.js
badd +28 ~/program/node/raptorTrading/controller/Transactions.js
badd +61 ~/program/node/raptorTrading/controller/transactions/trans.js
badd +12 ~/program/node/raptorTrading/tests/FundTest.js
badd +97 ~/program/node/raptorTrading/Utility.js
badd +19 ~/program/node/raptorTrading/tests/coinPurchaseTest.js
badd +11 ~/program/node/raptorTrading/routes/Transaction.js
badd +1 ~/program/node/raptorTrading/tests/api.js
badd +125 ~/program/node/raptorTrading/tools/recoverData.js
badd +6 ~/program/node/raptorTrading/models/DonationModel.js
badd +16 ~/program/node/raptorTrading/wazirx/api.js
badd +4 ~/program/node/raptorTrading/wazirx/tests/ordertest.js
badd +10 ~/program/node/raptorTrading/models/wazirx/LockedAssetModel.js
badd +23 ~/program/node/raptorTrading/controller/wazirx/WazirxTransaction.js
badd +59 ~/program/node/raptorTrading/controller/wazirx/trans.js
badd +10 ~/program/node/raptorTrading/routes/Wazirx.js
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 shortmess=filnxtToOFc
let &winminheight = s:save_winminheight
let &winminwidth = s:save_winminwidth
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
set hlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
