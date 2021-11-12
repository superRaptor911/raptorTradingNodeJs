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
badd +20 index.js
badd +14 routes/Coins.js
badd +58 controller/Coins.js
badd +1 .env
badd +8 db/db.js
badd +1 models/CoinModel.js
badd +13 tests/coinTest.js
badd +3 controller/coins/utility.js
badd +19 models/UserModel.js
badd +10 routes/User.js
badd +7 controller/User.js
badd +10 tests/userTest.js
badd +8 models/FundTransferModel.js
badd +13 controller/FundTransfer.js
badd +1 routes/FundTransfer.js
badd +53 controller/fund/fund.js
badd +7 models/TransactionModel.js
badd +6 controller/Transactions.js
badd +37 controller/transactions/trans.js
badd +12 tests/FundTest.js
badd +47 Utility.js
badd +19 tests/coinPurchaseTest.js
badd +11 routes/Transaction.js
badd +171 tests/api.js
badd +125 tools/recoverData.js
badd +6 models/DonationModel.js
argglobal
%argdel
$argadd index.js
edit controller/Transactions.js
argglobal
balt controller/FundTransfer.js
let s:l = 20 - ((18 * winheight(0) + 22) / 44)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 20
normal! 017|
lcd ~/program/node/raptorTrading
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0&& getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
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
