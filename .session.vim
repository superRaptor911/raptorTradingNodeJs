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
badd +16 index.js
badd +5 routes/Coins.js
badd +1 controller/Coins.js
badd +1 .env
badd +8 db/db.js
argglobal
%argdel
$argadd index.js
edit controller/Coins.js
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe '2resize ' . ((&lines * 2 + 23) / 47)
exe 'vert 2resize ' . ((&columns * 1 + 87) / 174)
exe '3resize ' . ((&lines * 2 + 23) / 47)
exe 'vert 3resize ' . ((&columns * 79 + 87) / 174)
argglobal
let s:l = 1 - ((0 * winheight(0) + 22) / 45)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 1
normal! 033|
lcd ~/program/node/raptorTrading
wincmd w
argglobal
enew
balt ~/program/node/raptorTrading/controller/Coins.js
lcd ~/program/node/raptorTrading
wincmd w
argglobal
enew
balt ~/program/node/raptorTrading/controller/Coins.js
lcd ~/program/node/raptorTrading
wincmd w
exe '2resize ' . ((&lines * 2 + 23) / 47)
exe 'vert 2resize ' . ((&columns * 1 + 87) / 174)
exe '3resize ' . ((&lines * 2 + 23) / 47)
exe 'vert 3resize ' . ((&columns * 79 + 87) / 174)
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
