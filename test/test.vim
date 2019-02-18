set nocompatible

let $NVIM_SRAN_LOG_FILE = expand('~/sran-nvim.log')
let $NVIM_SRAN_LOG_LEVEL = 'debug'

execute 'set rtp+=' . expand('<sfile>:p:h:h')
execute 'set rtp+=' . expand('<sfile>:p:h:h:h') . '/dict.nvim'
