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
badd +26 index.js
badd +10 routes/Coins.js
badd +9 controller/Coins.js
badd +1 .env
badd +8 db/db.js
badd +5 models/CoinModel.js
badd +16 tests/coinTest.js
badd +3 controller/coins/utility.js
badd +1 models/UserModel.js
badd +1 routes/User.js
badd +51 controller/User.js
badd +28 tests/userTest.js
badd +7 models/FundTransferModel.js
badd +53 controller/FundTransfer.js
badd +10 routes/FundTransfer.js
badd +34 controller/fund/fund.js
badd +15 models/TransactionModel.js
argglobal
%argdel
$argadd index.js
edit routes/FundTransfer.js
argglobal
let s:l = 11 - ((10 * winheight(0) + 22) / 45)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 11
normal! 040|
lcd ~/program/node/raptorTrading/routes
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
