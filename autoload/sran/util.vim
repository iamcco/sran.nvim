let s:sran_root_dir = expand('<sfile>:h:h:h')
let s:pre_build = s:sran_root_dir . '/bin/sran-'
let s:package_file = s:sran_root_dir . '/package.json'

" echo message
function! sran#util#echo_messages(hl, msgs)
  if empty(a:msgs) | return | endif
  execute 'echohl '.a:hl
  if type(a:msgs) ==# 1
    echomsg a:msgs
  else
    for msg in a:msgs
      echom msg
    endfor
  endif
  echohl None
endfunction

function! sran#util#get_platform() abort
  if has('win32') || has('win64')
    return 'win'
  elseif has('mac') || has('macvim')
    return 'macos'
  endif
  return 'linux'
endfunction

function! s:on_exit(autoclose, bufnr, Callback, job_id, status, ...)
  let content = join(getbufline(a:bufnr, 1, '$'), "\n")
  if a:status == 0 && a:autoclose == 1
    execute 'silent! bd! '.a:bufnr
  endif
  if !empty(a:Callback)
    call call(a:Callback, [a:status, a:bufnr, content])
  endif
endfunction

function! sran#util#open_terminal(opts) abort
  if get(a:opts, 'position', 'bottom') ==# 'bottom'
    let p = '5new'
  else
    let p = 'vnew'
  endif
  execute 'belowright '.p.' +setl\ buftype=nofile '
  setl buftype=nofile
  setl winfixheight
  setl norelativenumber
  setl nonumber
  setl bufhidden=wipe
  let cmd = get(a:opts, 'cmd', '')
  let autoclose = get(a:opts, 'autoclose', 1)
  if empty(cmd)
    throw 'command required!'
  endif
  let cwd = get(a:opts, 'cwd', '')
  if !empty(cwd) | execute 'lcd '.cwd | endif
  let keepfocus = get(a:opts, 'keepfocus', 0)
  let bufnr = bufnr('%')
  let Callback = get(a:opts, 'Callback', v:null)
  if has('nvim')
    call termopen(cmd, {
          \ 'on_exit': function('s:on_exit', [autoclose, bufnr, Callback]),
          \})
  else
    call term_start(cmd, {
          \ 'exit_cb': function('s:on_exit', [autoclose, bufnr, Callback]),
          \ 'curwin': 1,
          \})
  endif
  if keepfocus
    wincmd p
  endif
  return bufnr
endfunction

function! s:sran_prebuild_install(status, ...) abort
  if a:status != 0
    call sran#util#echo_messages('Error', '[sran]: install fail')
    return
  endif
  echo '[sran.nvim]: install cpmpleted'
endfunction

function! sran#util#install(...)
  let l:version = sran#util#pre_build_version()
  let l:info = json_decode(join(readfile(s:sran_root_dir . '/package.json'), ''))
  if trim(l:version) ==# trim(l:info.version)
    return
  endif
  let obj = json_decode(join(readfile(s:package_file)))
  let cmd = (sran#util#get_platform() ==# 'win' ? 'install.cmd' : './install.sh') . ' v'.obj['version']
  call sran#util#open_terminal({
        \ 'cmd': cmd,
        \ 'cwd': s:sran_root_dir,
        \ 'Callback': function('s:sran_prebuild_install')
        \})
  wincmd p
endfunction

function! sran#util#pre_build_version() abort
  let l:pre_build = s:pre_build . sran#util#get_platform()
  if filereadable(l:pre_build)
    let l:info = system(l:pre_build . ' --version')
    let l:info = split(l:info, '\n')
    return l:info[0]
  endif
  return ''
endfunction
