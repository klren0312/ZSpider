; HM NIS Edit Wizard helper defines
!include "MUI2.nsh"

; ; MUI Settings
!define MUI_ABORTWARNING

; 欢迎页面
!insertmacro MUI_PAGE_WELCOME
; 许可协议页面
!insertmacro MUI_PAGE_LICENSE "${BUILD_RESOURCES_DIR}\res\LICENCE.txt"

; 初始化开始菜单
!define PRODUCT_STARTMENU_REGVAL "NSIS:StartMenuDir"
!define MUI_STARTMENUPAGE_NODISABLE
Var StartMenuFolder
!insertmacro MUI_PAGE_STARTMENU Application $StartMenuFolder

ShowInstDetails show
ShowUnInstDetails show
SpaceTexts show

; 安装脚本
!macro customInstall

  ; 写入开始菜单
  CreateDirectory "$SMPROGRAMS\$StartMenuFolder"
  !insertmacro MUI_STARTMENU_WRITE_BEGIN Application
  CreateShortCut "$SMPROGRAMS\$StartMenuFolder\${PRODUCT_NAME}.lnk" "$INSTDIR\${PRODUCT_NAME}.exe"
  CreateShortCut "$SMPROGRAMS\$StartMenuFolder\卸载 ${PRODUCT_NAME}.lnk" "$INSTDIR\Uninstall ${PRODUCT_NAME}.exe"
  !insertmacro MUI_STARTMENU_WRITE_END
!macroend

; 卸载脚本
!macro customUnInstall
  !insertmacro MUI_STARTMENU_GETFOLDER Application $StartMenuFolder

  Delete "$SMPROGRAMS\$StartMenuFolder\${PRODUCT_NAME}.lnk"
  Delete "$SMPROGRAMS\$StartMenuFolder\卸载 ${PRODUCT_NAME}.lnk"

  RMDir "$SMPROGRAMS\$StartMenuFolder"
!macroend