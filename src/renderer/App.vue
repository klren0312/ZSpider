<template>
  <div id="app" :class="isLight ? '' : 'black'">
    <div class="theme-btn">
      <el-button @click="isLight = !isLight" size="mini" v-if="isLight" icon="el-icon-sunny" circle></el-button>
      <el-button @click="isLight = !isLight" size="mini" v-else icon="el-icon-moon" circle></el-button>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'spider-test',
    data () {
      return {
        isLight: true
      }
    }
  }
</script>

<style lang="scss">
// =================== 变量区域 =====================
$labelColor:#b1b1b9;
$fontColor: #a0a6af;
$sideBg: rgba(37, 38, 42, .7);
$cardBg: rgba(37, 38, 42, .5);
$tableBg: rgba(54, 55, 60, .5);
$inputBg: #36383e;
$inputBorder: #46484e;
$radioBg: #343438;
$disabledBg: rgba(52, 52, 56, .5);
$pageBg: #37383e;
  /* CSS */
body {
  .black {
    background: rgb(37, 37, 38);
    color: rgb(204, 204, 204);
    .el-table__body-wrapper.is-scrolling-left~.el-table__fixed-right,
    .el-table__body-wrapper.is-scrolling-middle~.el-table__fixed-right {
      background: #2b2d30;
    }
    .el-table__fixed-right {
      transition: background .2s linear;
    }


    .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {width:6px;height:6px;}
    .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {border-radius:3px;background-color: #999;}
    .el-table .el-table__body-wrapper::-webkit-scrollbar {width:6px;height:6px;}
    .el-table .el-table__body-wrapper::-webkit-scrollbar-thumb {border-radius:3px;background-color: #999;}

    .el-table thead th {
      color: #ffffff;
      padding-top: 20px;
      padding-bottom: 20px;
    }
    .el-table, .el-table__expanded-cell {
      background: transparent;
    }
    .el-table th, .el-table tr {
      background: none;
      border-bottom: 0;
      color: $fontColor;
    }

    .el-table__body tr.hover-row>td {
      background: none;
    }

    .el-table--enable-row-hover .el-table__body tr:hover>td {
      background: transparent;
    
    }
    .el-table__body tr.hover-row>td .el-icon-edit {
      visibility: unset;
      cursor: pointer;
    }
    .el-table thead th {
      background: none;
    }
    .el-table__body-wrapper .el-table__row,
    .el-loading-mask {
      background: $tableBg;
    }

    .el-table--striped .el-table__body tr.el-table__row--striped td,
    .el-table__body-wrapper .el-table__row.el-table__row--striped {
      background: none;
    }

    .el-table td, .el-table th.is-leaf {
      border: 0;
    }
    .el-table--border::after, .el-table--group::after, .el-table::before,
    .el-table__fixed-right::before, .el-table__fixed::before {
      background: transparent;
    }
    .el-checkbox {
      color: $fontColor;
    }
    .el-checkbox__inner {
      background: #4a4b4f;
      border-color: #4a4b4f;
    }
    .el-checkbox__input.is-disabled+span.el-checkbox__label {
      color: unset;
    }
    .el-table-column--selection {
      border-radius: 2em 0 0 2em;
      padding-left: 24px !important;
    }

    .el-table thead .el-table_1_column_1 {
      border-radius: 0;
    }
    .el-form-item__label,
    .el-form-item__content  {
      color: $labelColor;
      font-size: 14px;
    }

    .el-input--suffix .el-input__inner,
    .el-input__inner,
    .el-textarea__inner,
    .el-select-dropdown,
    .el-select-dropdown__item.hover, .el-select-dropdown__item:hover,
    .el-date-editor .el-range-input,
    .el-radio-button__inner,
    .el-radio-button:first-child .el-radio-button__inner,
    .el-input.is-disabled .el-input__inner {
      background:$disabledBg;
      border-color: $inputBorder;
      color: $labelColor;
    }
    .el-picker-panel,
    .el-select-dropdown, .el-select-dropdown__item.hover, 
    .el-select-dropdown__item:hover,
    .el-cascader-menu {
      background: $radioBg;
    }
    .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      background: $radioBg;
      border-color: $inputBorder;
      color: $labelColor;
      box-shadow: none;
    }
    .el-cascader-menus {
      border: 0;
    }
    .el-cascader__label {
      color: $labelColor;
    }
    .el-date-editor .el-range-input {
      background: transparent;
    }
    .el-date-editor .el-range-separator {
      color: $labelColor;
    }
    .el-popper[x-placement^=bottom] .popper__arrow::after {
      border-bottom-color: $radioBg;
    }
    .el-input-number__decrease, .el-input-number__increase,
    .el-input-number.is-controls-right .el-input-number__decrease,
    .el-input-number.is-controls-right .el-input-number__increase {
      background: $radioBg;
      border-color: $inputBorder;
    }

    .el-select:hover .el-input__inner {
      border-color: #57595e;
    }
    .el-input__inner:hover,
    .el-textarea__inner:hover {
      border-color: #57595e;
    }
    input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
      background-color: transparent !important;
    }
    .el-select-dropdown__item {
      color: #fff;
    }
    .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
      color: #409EFF;
      font-weight: 700;
    }
  }
  .theme-btn {
    text-align: right;
  }
}
</style>
