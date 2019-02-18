"===============================================================================
"File: plugin/sran.vim
"Maintainer: iamcco <ooiss@qq.com>
"Github: http://github.com/iamcco <年糕小豆汤>
"Licence: Vim Licence
"===============================================================================

if exists('g:loaded_dict_nvim')
    finish
endif
let g:loaded_dict_nvim= 1

let s:save_cpo = &cpo
set cpo&vim

if v:vim_did_enter
  call sran#rpc#start_server()
else
  augroup Sran_nvim
    autocmd!
    autocmd VimEnter * call sran#rpc#start_server()
  augroup END
endif

let &cpo = s:save_cpo
unlet s:save_cpo
