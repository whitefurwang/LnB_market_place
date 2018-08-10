<template>
  <div class='modal fade' id='modal' ref='modal'>
    <div class='modal-dialog'>
      <div class='modal-content'>
        <slot name='header'></slot>
        <slot name='body'></slot>
        <slot name='footer'></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    mounted () {
      $(this.$refs.modal).on('hidden.bs.modal', () => {
        $(window).off('keydown.hideModal')
      })

      $(this.$refs.modal).on('shown.bs.modal', () => {
        $(window).on('keydown.hideModal', e => {
          if (e.keyCode === 27) {
            $(this.$refs.modal).modal('hide')
          }
        })
      })
    }
  }
</script>