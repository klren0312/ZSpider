<template>
  <div class="ctrl-btn-group">
    <button class="btn setting-btn" @click="toSetting"></button>
    <button class="btn min-btn" @click="ctrl('min')"></button>
    <button
      class="btn"
      :class="isFullScreen ? 'max-s-btn' : 'max-b-btn'"
      @click="ctrl('max')"
    ></button>
    <button class="btn cancel-btn" @click="ctrl('close')"></button>
    <el-dialog
      title="设置"
      :visible.sync="settingDialog"
      :append-to-body="true"
      width="60%"
    >
      <el-form label-width="140px">
        <el-form-item label="Chrome安装目录:">
          <el-input size="mini" v-model="settingForm.chromePath"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="settingDialog = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
const { ipcRenderer: ipc } = require('electron')
export default {
  name: 'CtrlBtnGroup',
  data() {
    return {
      isFullScreen: false,
      settingDialog: false,
      settingForm: {
        chromePath: '',
      },
    }
  },
  methods: {
    ctrl(type) {
      ipc.send(type)
    },
    toSetting() {
      this.settingDialog = true
      this.settingForm.chromePath = this.$store.state.chromePath
    },
    save() {
      if (!this.settingForm.chromePath) {
        this.$alert('Chrome安装目录不可为空', '错误', {
          confirmButtonText: '确定',
          callback: () => {},
        })
        return
      }
      this.$store.dispatch('SET_CHROME', this.settingForm.chromePath)
      this.settingDialog = false
      this.$alert('修改成功', '提示', {
        confirmButtonText: '确定',
        callback: () => {},
      })
    },
  },
  mounted() {
    ipc.on('fullScreenStatus', (event, arg) => {
      this.isFullScreen = arg
    })
  },
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
    opacity: 0.5;
  }
}
.setting-btn {
  background: url(data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPjxwYXRoIGQ9Ik04MjUuNjA2IDY0Ny41MzhsLTYuMzQyIDEyLjcyIDcuOTQ0IDExLjc4NyA3OC4xMiAxMTUuODk3IDMuMTk2LTMxLjA4NEw3NjkuNTQgODkyLjM3NGwyOS41LTMuNDg5LTEyNy41NjItNzYuMDAyLTEwLjU1OC02LjI5LTExLjMzNyA0Ljc0NmEzNTQuMTA0IDM1NC4xMDQgMCAwIDEtMjQuNTQxIDkuMjIxbC0xMy4yMyA0LjQyLTIuODk2IDEzLjY0NC0yNy45MiAxMzEuNTUyIDIzLjg1LTE5LjMxOUg0MDguMjcybDIzLjY2NyAxOC41MjEtMzQuMDk3LTEzNy43MDUtMy4wNDEtMTIuMjgxLTExLjc5My00LjU4NGEzNTQuMjE0IDM1NC4yMTQgMCAwIDEtMjEuODE4LTkuMzM1bC0xMi4xNzItNS42OTctMTEuMzE3IDcuMjUtMTE5LjgyIDc2Ljc3NCAzMC4xNzQgMy4wNzItMTM4Ljk4My0xMzUuNTA4IDMuNjM4IDMwLjQwNCA3Ny45NDEtMTI0LjM1OSA2Ljg5Ni0xMS4wMDItNS4yODEtMTEuODYxYTMzMy4zOTUgMzMzLjM5NSAwIDAgMS0xMC0yNS4xNjhsLTQuNTkxLTEzLjA4NC0xMy41OTMtMi43NDItMTM0Ljg4LTI3LjIwNCAxOS41NiAyMy45di0xOTEuNjVMMjkuOTY2IDQyMi4zM2wxNDEuMjU1LTMzLjI0NCAxMi4yMy0yLjg3OCA0Ljc1My0xMS42M2EzMzQuOTAyIDMzNC45MDIgMCAwIDEgMTEuMzI3LTI0Ljc3NWw2LjQyOS0xMi42NzMtNy44NTktMTEuODQtNzMuNDE1LTExMC42MS0zLjE2IDMwLjgwOCAxMzguMTYxLTEzNi43ODctMjkuNzc1IDMuNTM0IDEyMi43ODEgNzQuMjkgMTAuNTk0IDYuNDEgMTEuNDI1LTQuNzc0YTM1NC4xMDMgMzU0LjEwMyAwIDAgMSAyMC4xMjMtNy42OTRsMTIuNDgtNC4zNDIgMy4xNzUtMTIuODI1TDQ0My40MzcgMzAuMjRsLTIzLjY2NiAxOC41MmgxOTYuNTU2bC0yMy44NS0xOS4zMTkgMjguODQ4IDEzNS45MyAyLjc4IDEzLjEgMTIuNTQ2IDQuNjgxYTM1My4wNTggMzUzLjA1OCAwIDAgMSAyOS45NzcgMTIuNzlsMTIuMTY4IDUuODcyIDExLjQzLTcuMjA1IDExMy40NDktNzEuNTItMjkuODgzLTMuMDMyIDE0MC4zNyAxMzQuNjk3LTMuNjgzLTMwLjY5LTc2LjI2OSAxMTkuNzQ5LTYuOTkyIDEwLjk3OCA1LjIzMiAxMS45MTlhMzMyLjgzNCAzMzIuODM0IDAgMCAxIDkuODAzIDI1LjA0Mmw0LjM4NiAxMi42OTMgMTMuMDczIDMuMDc2IDEzNC4zMjIgMzEuNjA5LTE4Ljc5Ni0yMy43MzN2MTkxLjY1bDE5LjU2LTIzLjktMTQxLjgxNSAyOC42MDctMTIuNzMzIDIuNTY4LTQuOTcgMTJhMzM0LjQ3IDMzNC40NyAwIDAgMS05LjY3NCAyMS4yMTV6bTMyLjE5OC0xMS44ODRsNC44MiAyMy45IDE0MS44MTYtMjguNjA2IDE5LjU2LTMuOTQ2VjM5Ni4wODhsLTE4Ljc5Ni00LjQyMi0xMzQuMzIyLTMxLjYxLTUuNTg1IDIzLjczNCAyMy4wNDQtNy45NjRhMzgxLjU5NSAzODEuNTk1IDAgMCAwLTExLjI0Mi0yOC43MTRsLTIyLjMyNSA5LjggMjAuNTY1IDEzLjA5NyA3Ni4yNjktMTE5Ljc0OCAxMC43MzQtMTYuODU0LTE0LjQxOC0xMy44MzYtMTQwLjM3LTEzNC42OTctMTMuNzU2LTEzLjItMTYuMTI3IDEwLjE2Ny0xMTMuNDUgNzEuNTIgMTMuMDAyIDIwLjYyNCAxMC41OTYtMjEuOTU4YTQwMS44MiA0MDEuODIgMCAwIDAtMzQuMTItMTQuNTU5bC04LjUyNCAyMi44NDMgMjMuODUtNS4wNjItMjguODQ4LTEzNS45M0w2MzYuMDc3IDBINDAwLjY5bC00LjU4NiAxOC41Mi0zMi45NDcgMTMzLjA2IDIzLjY2NiA1Ljg2LTguMDEtMjMuMDI4YTQwMi44NjMgNDAyLjg2MyAwIDAgMC0yMi44OTcgOC43NTZsOS4zOTggMjIuNDk2IDEyLjYyMS0yMC44Ni0xMjIuNzgxLTc0LjI4OC0xNi4yNjUtOS44NDItMTMuNTEgMTMuMzc1TDg3LjIyIDIxMC44MzZsLTE0LjI0OCAxNC4xMDUgMTEuMDg3IDE2LjcwNCA3My40MTUgMTEwLjYxIDIwLjMxNC0xMy40ODItMjEuNzQzLTExLjAzYTM4My42NjMgMzgzLjY2MyAwIDAgMC0xMi45NzggMjguMzg1bDIyLjU2OSA5LjIyNS01LjU4Ni0yMy43MzItMTQxLjI1NCAzMy4yNDRMMCAzNzkuMjg4VjYxMC4yMDJsMTkuNTYgMy45NDUgMTM0Ljg4MSAyNy4yMDQgNC44Mi0yMy45LTIzLjAwNSA4LjA3NWEzODIuMTU2IDM4Mi4xNTYgMCAwIDAgMTEuNDYzIDI4Ljg1MmwyMi4yNzMtOS45MTYtMjAuNjU4LTEyLjk0OC03Ny45NDEgMTI0LjM1OS0xMC40NDggMTYuNjcgMTQuMDg2IDEzLjczNCAxMzguOTgzIDEzNS41MDggMTMuODY3IDEzLjUyIDE2LjMwNy0xMC40NDggMTE5LjgyLTc2Ljc3My0xMy4xNTMtMjAuNTI5LTEwLjMzNiAyMi4wODJhNDAyLjk3NCA0MDIuOTc0IDAgMCAwIDI0LjgyNCAxMC42Mmw4LjgzMi0yMi43MjQtMjMuNjY2IDUuODYgMzQuMDk3IDEzNy43MDUgNC41ODYgMTguNTIxaDIzNS40MDRsNC4xLTE5LjMyIDI3LjkyLTEzMS41NTItMjMuODUtNS4wNjEgNy43MjMgMjMuMTI1YTQwMi44NjYgNDAyLjg2NiAwIDAgMCAyNy45MjUtMTAuNDkzbC05LjQxNS0yMi40OS0xMi40OCAyMC45NDYgMTI3LjU2MyA3Ni4wMDEgMTYuMDkgOS41ODcgMTMuNDEtMTMuMDc1TDk0Mi41NjUgNzkxLjc3bDE0LjU3MS0xNC4yMDgtMTEuMzc0LTE2Ljg3NS03OC4xMi0xMTUuODk4LTIwLjIxNyAxMy42MjggMjEuODIgMTAuODc5YTM4My4yMyAzODMuMjMgMCAwIDAgMTEuMDgzLTI0LjMxMWwtMjIuNTI0LTkuMzMyek03MzEuNDI5IDQ5OS44MWMwLTExNC40NTUtOTIuNzg0LTIwNy4yMzktMjA3LjIzOS0yMDcuMjM5LTExNC40NTQgMC0yMDcuMjM4IDkyLjc4NC0yMDcuMjM4IDIwNy4yMzkgMCAxMTQuNDU0IDkyLjc4NCAyMDcuMjM4IDIwNy4yMzggMjA3LjIzOCAyOS4zMTUgMCA1Ny44MTYtNi4xMDUgODQuMDYzLTE3Ljc2NSAxMi4zMDYtNS40NjcgMTcuODUtMTkuODc0IDEyLjM4My0zMi4xOC01LjQ2Ny0xMi4zMDYtMTkuODc0LTE3Ljg1LTMyLjE4LTEyLjM4My0yMC4wNDQgOC45MDUtNDEuODA0IDEzLjU2Ni02NC4yNjYgMTMuNTY2LTg3LjUyNCAwLTE1OC40NzYtNzAuOTUyLTE1OC40NzYtMTU4LjQ3NnM3MC45NTItMTU4LjQ3NyAxNTguNDc2LTE1OC40NzcgMTU4LjQ3NyA3MC45NTMgMTU4LjQ3NyAxNTguNDc3YzAgMTEuNTY0LTEuMjM1IDIyLjk1Mi0zLjY2IDM0LjAzNy0yLjg3NiAxMy4xNTUgNS40NTYgMjYuMTUgMTguNjEgMjkuMDI3IDEzLjE1NCAyLjg3NyAyNi4xNS01LjQ1NSAyOS4wMjctMTguNjA5YTIwNy45MTYgMjA3LjkxNiAwIDAgMCA0Ljc4NS00NC40NTV6IiBmaWxsPSIjZmZmIi8+PC9zdmc+)
    center / contain no-repeat;
}
.min-btn {
  background: url(data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxwYXRoIGQ9Ik0xMjggNDQ4aDc2OHYxMjhIMTI4eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==)
    center / contain no-repeat;
}

.max-b-btn {
  background: url(data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEzNjUgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNDIuNjU2IiBoZWlnaHQ9IjMyIj48cGF0aCBkPSJNMTE0MC45ODIgMGMzMC41MyAwIDU1LjI3OCAyNC43NDkgNTUuMjc4IDU1LjI3OHY0MjYuNTI0YzAgMzAuNTI5LTI0Ljc0OSA1NS4yNzgtNTUuMjc4IDU1LjI3OHMtNTUuMjc3LTI0Ljc0OS01NS4yNzctNTUuMjc4VjU1LjI3OGw1NS4yNzcgNTUuMjc3SDcwNy4yOTFjLTMwLjUzIDAtNTUuMjc4LTI0Ljc0OC01NS4yNzgtNTUuMjc3QzY1Mi4wMTMgMjQuNzQ4IDY3Ni43NjIgMCA3MDcuMjkxIDBoNDMzLjY5MXpNMjIzLjg5NiAxMDI0LjAyOGMtMzAuNTI5IDAtNTUuMjc3LTI0Ljc0OC01NS4yNzctNTUuMjc3VjU0Mi4yMjZjMC0zMC41MjkgMjQuNzQ4LTU1LjI3NyA1NS4yNzctNTUuMjc3IDMwLjUzIDAgNTUuMjc4IDI0Ljc0OCA1NS4yNzggNTUuMjc3djQyNi41MjVsLTU1LjI3OC01NS4yNzhoNDMzLjY5MmMzMC41MjkgMCA1NS4yNzcgMjQuNzQ5IDU1LjI3NyA1NS4yNzhzLTI0Ljc0OCA1NS4yNzctNTUuMjc3IDU1LjI3N0gyMjMuODk2eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==)
    center / contain no-repeat;
}
.max-s-btn {
  background: url(data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxwYXRoIGQ9Ik05NTkuNzIgMEgyOTQuMjE2YTYzLjk2IDYzLjk2IDAgMCAwLTYzLjk2IDYzLjk2djEyNy45Mkg2NC4yOEE2My45NiA2My45NiAwIDAgMCAuMzIgMjU1Ljg0Vjk1OS40YTYzLjk2IDYzLjk2IDAgMCAwIDYzLjk2IDYzLjk2aDcwMy41NmE2My45NiA2My45NiAwIDAgMCA2My45Ni02My45NlY3OTIuNDY1aDEyNy45MmE2My45NiA2My45NiAwIDAgMCA2My45Ni02My45NlY2My45NkE2My45NiA2My45NiAwIDAgMCA5NTkuNzIgMHpNNzY3Ljg0IDcyOC41MDVWOTU5LjRINjQuMjhWMjU1Ljg0aDcwMy41NnptMTg5LjMyMiAwSDgzMS44VjI1NS44NGE2My45NiA2My45NiAwIDAgMC02My45Ni02My45NkgyOTQuMjE2VjYzLjk2SDk1OS43MnoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=)
    center / contain no-repeat;
}

.cancel-btn {
  background: url(data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxwYXRoIGQ9Ik0xNTUuMjUyIDk0My44MjVjLTE5LjIxMyAwLTM4LjQyOS03LjMzMi01My4wODktMjEuOTg4LTI5LjMxNy0yOS4zMjEtMjkuMzE3LTc2Ljg1NSAwLTEwNi4xNzVsNzEzLjQ5NC03MTMuNDk0YzI5LjMxNy0yOS4zMjEgNzYuODUzLTI5LjMyMSAxMDYuMTc1IDAgMjkuMzE3IDI5LjMxNyAyOS4zMTcgNzYuODU1IDAgMTA2LjE3NUwyMDguMzM4IDkyMS44MzdjLTE0LjY2IDE0LjY2LTMzLjg3NCAyMS45ODgtNTMuMDg5IDIxLjk4OHoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNODY4Ljc0OSA5NDMuODI0Yy0xOS4yMTMgMC0zOC40MjgtNy4zMzItNTMuMDg5LTIxLjk4OEwxMDIuMTY2IDIwOC4zNDNjLTI5LjMxNy0yOS4zMTctMjkuMzE3LTc2Ljg1NyAwLTEwNi4xNzUgMjkuMzE2LTI5LjMxNyA3Ni44NTUtMjkuMzIxIDEwNi4xNzQgMEw5MjEuODM0IDgxNS42NmMyOS4zMTcgMjkuMzIxIDI5LjMxNyA3Ni44NTUgMCAxMDYuMTc1LTE0LjY1NyAxNC42NjEtMzMuODcxIDIxLjk5My01My4wODcgMjEuOTkzeiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==)
    center / contain no-repeat;
}
</style>
