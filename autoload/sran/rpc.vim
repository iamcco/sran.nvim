let s:sran_root_dir = expand('<sfile>:h:h:h')
let s:is_vim = !has('nvim')
let s:sran_channel_id = s:is_vim ? v:null : -1
let s:is_vim_node_rpc_ready = v:null

function! s:on_stdout(chan_id, msgs, ...) abort
  call sran#util#echo_messages('Error', a:msgs)
endfunction
function! s:on_stderr(chan_id, msgs, ...) abort
  call sran#util#echo_messages('Error', a:msgs)
endfunction
function! s:on_exit(chan_id, code, ...) abort
  let s:sran_channel_id = s:is_vim ? v:null : -1
  let g:sran_node_channel_id = -1
endfunction

function! s:start_vim_node_rpc() abort
  if empty($SRAN_NVIM_LISTEN_ADDRESS)
    let command = sran#nvim#rpc#get_command()
    if empty(command) | return | endif
    call sran#nvim#rpc#start_server()
  endif
endfunction

function! s:start_vim_server(cmd) abort
  let options = {
        \ 'err_mode': 'nl',
        \ 'out_mode': 'nl',
        \ 'out_cb': function('s:on_stdout'),
        \ 'err_cb': function('s:on_stderr'),
        \ 'exit_cb': function('s:on_exit'),
        \ 'env': {
        \   'VIM_NODE_RPC': 1,
        \   'SRAN_NVIM_LISTEN_ADDRESS': $SRAN_NVIM_LISTEN_ADDRESS,
        \ }
        \}
  if has("patch-8.1.350")
    let options['noblock'] = 1
  endif
  let l:job = job_start(a:cmd, options)
  let l:status = job_status(l:job)
  if l:status !=# 'run'
    echohl Error | echon 'Failed to start vim-node-rpc service' | echohl None
    return
  endif
  let s:sran_channel_id = l:job
  if s:is_vim_node_rpc_ready ==# v:null
    let s:is_vim_node_rpc_ready = v:true
    autocmd! User SranNvimRpcInit
    unlet s:cb
  endif
endfunction

function! sran#rpc#start_server() abort
  if s:is_vim
    call s:start_vim_node_rpc()
  endif
  let l:sran_server_script = s:sran_root_dir . '/bin/sran-' . sran#util#get_platform()
  if executable(l:sran_server_script)
    let l:cmd = [l:sran_server_script, '--path', s:sran_root_dir . '/lib/index.js']
  elseif executable('node')
    let l:sran_server_script = s:sran_root_dir . '/lib/app.js'
    let l:cmd = ['node', l:sran_server_script, '--path', s:sran_root_dir . '/lib/index.js']
  endif
  if exists('l:cmd')
    if s:is_vim
      if s:is_vim_node_rpc_ready ==# v:null
        let s:cb = function('s:start_vim_server', [l:cmd])
        autocmd User SranNvimRpcInit call s:cb()
      else
        call s:start_vim_server(l:cmd)
      endif
    else
      let s:sran_channel_id = jobstart(l:cmd, {
            \ 'on_stdout': function('s:on_stdout'),
            \ 'on_stderr': function('s:on_stderr'),
            \ 'on_exit': function('s:on_exit')
            \ })
    endif
  else
    call sran#util#echo_messages('Error', 'Pre build and node is not found')
  endif
endfunction

function! sran#rpc#stop_server() abort
  if s:is_vim
    if s:sran_channel_id !=# v:null
      let l:status = job_status(s:sran_channel_id)
      if l:status ==# 'run'
        try
          call job_stop(s:sran_channel_id)
        catch /.*/
        endtry
      endif
    endif
    let s:sran_channel_id = v:null
    let g:sran_node_channel_id = -1
  else
    if s:sran_channel_id !=# -1
      try
        call jobstop(s:sran_channel_id)
      catch /.*/
      endtry
    endif
    let s:sran_channel_id = -1
    let g:sran_node_channel_id = -1
  endif
endfunction

function! sran#rpc#get_server_status() abort
  if s:is_vim && s:sran_channel_id ==# v:null
    return -1
  elseif !s:is_vim && s:sran_channel_id ==# -1
    return -1
  elseif !exists('g:sran_node_channel_id') || g:sran_node_channel_id ==# -1
    return 0
  endif
  return 1
endfunction
