<template>
  <div class="ctrl-btn-group">
    <button class="btn min-btn" @click="ctrl('min')"></button>
    <button class="btn" :class="isFullScreen ? 'max-s-btn' : 'max-b-btn'" @click="ctrl('max')"></button>
    <button class="btn cancel-btn" @click="ctrl('close')"></button>
  </div>
</template>
<script>
const {ipcRenderer: ipc} = require('electron')
export default {
  name: 'CtrlBtnGroup',
  data () {
    return {
      isFullScreen: false
    }
  },
  methods: {
    ctrl (type) {
      ipc.send(type)
    }
  },
  mounted () {
    ipc.on('fullScreenStatus', (event, arg) => {
      this.isFullScreen = arg
    })
  }
}
</script>
<style lang="scss" scoped>
.btn {
  width: 14px;
  height: 14px;
  padding: 0 15px;
  border: 0;
  -webkit-app-region: no-drag;
  cursor: pointer;
  &:focus {
    outline: none;
  }
  &:hover {
    opacity: .5;
  }
}
.min-btn {
  background: url(data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxwYXRoIGQ9Ik0xMjggNDQ4aDc2OHYxMjhIMTI4eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==) center / contain no-repeat;
}

.max-b-btn {
  background: url(data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEzNjUgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNDIuNjU2IiBoZWlnaHQ9IjMyIj48cGF0aCBkPSJNMTE0MC45ODIgMGMzMC41MyAwIDU1LjI3OCAyNC43NDkgNTUuMjc4IDU1LjI3OHY0MjYuNTI0YzAgMzAuNTI5LTI0Ljc0OSA1NS4yNzgtNTUuMjc4IDU1LjI3OHMtNTUuMjc3LTI0Ljc0OS01NS4yNzctNTUuMjc4VjU1LjI3OGw1NS4yNzcgNTUuMjc3SDcwNy4yOTFjLTMwLjUzIDAtNTUuMjc4LTI0Ljc0OC01NS4yNzgtNTUuMjc3QzY1Mi4wMTMgMjQuNzQ4IDY3Ni43NjIgMCA3MDcuMjkxIDBoNDMzLjY5MXpNMjIzLjg5NiAxMDI0LjAyOGMtMzAuNTI5IDAtNTUuMjc3LTI0Ljc0OC01NS4yNzctNTUuMjc3VjU0Mi4yMjZjMC0zMC41MjkgMjQuNzQ4LTU1LjI3NyA1NS4yNzctNTUuMjc3IDMwLjUzIDAgNTUuMjc4IDI0Ljc0OCA1NS4yNzggNTUuMjc3djQyNi41MjVsLTU1LjI3OC01NS4yNzhoNDMzLjY5MmMzMC41MjkgMCA1NS4yNzcgMjQuNzQ5IDU1LjI3NyA1NS4yNzhzLTI0Ljc0OCA1NS4yNzctNTUuMjc3IDU1LjI3N0gyMjMuODk2eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==) center / contain no-repeat;
}
.max-s-btn {
  background: url(data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxwYXRoIGQ9Ik05NTkuNzIgMEgyOTQuMjE2YTYzLjk2IDYzLjk2IDAgMCAwLTYzLjk2IDYzLjk2djEyNy45Mkg2NC4yOEE2My45NiA2My45NiAwIDAgMCAuMzIgMjU1Ljg0Vjk1OS40YTYzLjk2IDYzLjk2IDAgMCAwIDYzLjk2IDYzLjk2aDcwMy41NmE2My45NiA2My45NiAwIDAgMCA2My45Ni02My45NlY3OTIuNDY1aDEyNy45MmE2My45NiA2My45NiAwIDAgMCA2My45Ni02My45NlY2My45NkE2My45NiA2My45NiAwIDAgMCA5NTkuNzIgMHpNNzY3Ljg0IDcyOC41MDVWOTU5LjRINjQuMjhWMjU1Ljg0aDcwMy41NnptMTg5LjMyMiAwSDgzMS44VjI1NS44NGE2My45NiA2My45NiAwIDAgMC02My45Ni02My45NkgyOTQuMjE2VjYzLjk2SDk1OS43MnoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=) center / contain no-repeat;
}

.cancel-btn {
  background: url(data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxwYXRoIGQ9Ik0xNTUuMjUyIDk0My44MjVjLTE5LjIxMyAwLTM4LjQyOS03LjMzMi01My4wODktMjEuOTg4LTI5LjMxNy0yOS4zMjEtMjkuMzE3LTc2Ljg1NSAwLTEwNi4xNzVsNzEzLjQ5NC03MTMuNDk0YzI5LjMxNy0yOS4zMjEgNzYuODUzLTI5LjMyMSAxMDYuMTc1IDAgMjkuMzE3IDI5LjMxNyAyOS4zMTcgNzYuODU1IDAgMTA2LjE3NUwyMDguMzM4IDkyMS44MzdjLTE0LjY2IDE0LjY2LTMzLjg3NCAyMS45ODgtNTMuMDg5IDIxLjk4OHoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNODY4Ljc0OSA5NDMuODI0Yy0xOS4yMTMgMC0zOC40MjgtNy4zMzItNTMuMDg5LTIxLjk4OEwxMDIuMTY2IDIwOC4zNDNjLTI5LjMxNy0yOS4zMTctMjkuMzE3LTc2Ljg1NyAwLTEwNi4xNzUgMjkuMzE2LTI5LjMxNyA3Ni44NTUtMjkuMzIxIDEwNi4xNzQgMEw5MjEuODM0IDgxNS42NmMyOS4zMTcgMjkuMzIxIDI5LjMxNyA3Ni44NTUgMCAxMDYuMTc1LTE0LjY1NyAxNC42NjEtMzMuODcxIDIxLjk5My01My4wODcgMjEuOTkzeiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==) center / contain no-repeat;
} 
</style>