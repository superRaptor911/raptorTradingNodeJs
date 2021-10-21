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
badd +13 index.js
badd +10 routes/Coins.js
badd +58 controller/Coins.js
badd +1 .env
badd +8 db/db.js
badd +1 models/CoinModel.js
badd +13 tests/coinTest.js
badd +3 controller/coins/utility.js
badd +19 models/UserModel.js
badd +1 routes/User.js
badd +1 controller/User.js
badd +10 tests/userTest.js
badd +8 models/FundTransferModel.js
badd +29 controller/FundTransfer.js
badd +1 routes/FundTransfer.js
badd +36 controller/fund/fund.js
badd +7 models/TransactionModel.js
badd +8 controller/Transactions.js
badd +45 controller/transactions/trans.js
badd +12 tests/FundTest.js
badd +1 Utility.js
badd +19 tests/coinPurchaseTest.js
badd +11 routes/Transaction.js
badd +132 tests/api.js
badd +5 tools/recoverData.js
badd +6 models/DonationModel.js
argglobal
%argdel
$argadd index.js
edit tests/coinPurchaseTest.js
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
exe 'vert 1resize ' . ((&columns * 86 + 87) / 174)
exe 'vert 2resize ' . ((&columns * 87 + 87) / 174)
argglobal
balt tests/api.js
let s:l = 19 - ((18 * winheight(0) + 22) / 45)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 19
normal! 0
lcd ~/program/node/raptorTrading
wincmd w
argglobal
if bufexists("~/program/node/raptorTrading/tests/api.js") | buffer ~/program/node/raptorTrading/tests/api.js | else | edit ~/program/node/raptorTrading/tests/api.js | endif
if &buftype ==# 'terminal'
  silent file ~/program/node/raptorTrading/tests/api.js
endif
balt ~/program/node/raptorTrading/index.js
let s:l = 5 - ((4 * winheight(0) + 22) / 45)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 5
normal! 0
lcd ~/program/node/raptorTrading
wincmd w
2wincmd w
exe 'vert 1resize ' . ((&columns * 86 + 87) / 174)
exe 'vert 2resize ' . ((&columns * 87 + 87) / 174)
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0&& getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
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
