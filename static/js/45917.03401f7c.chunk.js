"use strict";(self.webpackChunkweb=self.webpackChunkweb||[]).push([[45917],{145917:(e,t,n)=>{n.r(t),n.d(t,{default:()=>R});var c=n(18861),u=n(759274),l=n(202784),r=n(475976),a=n(945821),o=n(634795),f=n(720587),i=n(292147),d=n(950585),s=n(379573),v=n(717073),S=s.default.actions,p=S.updateIsLoading,h=S.updatePreloadingCreateAccount,w=S.updateSelectedWalletId,A=S.updateSelectedNetworkId;function b(){return function(){var e=(0,v.useAccountSelectorInfo)(),t=e.isOpenDelay,n=(e.isCloseFromOpen,e.preloadingCreateAccount),c=e.activeWallet,u=(e.activeNetwork,e.activeAccount,e.activeWalletRef),r=e.activeNetworkRef,s=e.isOpen,S=a.default.serviceAccountSelector,b=a.default.dispatch;(0,l.useRef)().current=t&&s,(0,l.useRef)(n).current=n;var k=(0,l.useCallback)((function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:{}).runAfterInteractions?f.default.runAfterInteractions((function(){return S.setSelectedWalletToActive()})):S.setSelectedWalletToActive()}),[S]);(0,l.useEffect)((function(){return i.default.accountSelector.info("useAccountSelectorEffects mount"),function(){i.default.accountSelector.info("useAccountSelectorEffects unmounted")}}),[]),(0,l.useEffect)((function(){c&&k({runAfterInteractions:!0})}),[c,k]),(0,d.useEffectOnUpdate)((function(){var e=function(){var e=(0,o.default)((function*(){if(!t){var e,n,c=null==(e=u.current)?void 0:e.id,l=null==(n=r.current)?void 0:n.id;b(p(!1),h(void 0),w(c),A(l)),i.default.accountSelector.info("Reset selected walletId & networkId after close",{networkId:l,walletId:c})}}));return function(){return e.apply(this,arguments)}}();e()}),[t])}(),null}var k=n(432986),I=n(731923);function W(){return function(){var e=(0,I.useWalletSelectorStatus)(),t=e.visible,n=e.existsHardwareWallet;(0,l.useEffect)((function(){return i.default.accountSelector.info("WalletSelectorTrigger mount"),function(){i.default.accountSelector.info("WalletSelectorTrigger unmounted")}}),[]),(0,l.useEffect)((function(){i.default.accountSelector.info(`WalletSelector visible=${t.toString()}`),t&&n&&k.deviceUtils.syncDeviceConnectStatus()}),[n,t])}(),null}var g=n(586685),m=n(149904),C=n(358499),E=n(552322),x=(0,m.createLazyComponent)((function(){return n.e(91494).then(n.bind(n,391494))})),y=(0,m.createLazyComponent)((function(){return Promise.all([n.e(18468),n.e(37424),n.e(68722)]).then(n.bind(n,146580))}));const R=function(){var e=a.default.dispatch,t=(0,u.default)().reduxReady;return(0,l.useEffect)((function(){var n;t&&(C.default.addUpdaterListener(),null==(n=C.default.checkUpdate())||n.then((function(t){t&&e((0,g.enable)(),(0,g.available)(t))})).catch())}),[e,t]),(0,E.jsxs)(c.default,{ref:r.setMainScreenDom,w:"full",h:"full",children:[(0,E.jsx)(y,{}),(0,E.jsx)(b,{}),(0,E.jsx)(W,{}),(0,E.jsx)(x,{})]})}}}]);