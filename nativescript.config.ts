import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.nativescript.echartscanvas',
  appPath: 'app',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc --allow-natives-syntax --turbo-fast-api-calls',
    markingMode: 'none'
  }
} as NativeScriptConfig;