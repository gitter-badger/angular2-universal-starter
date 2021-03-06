import { platform, provide } from 'angular2/core';
import { 
  WebWorkerInstance, 
  WORKER_RENDER_APP, 
  WORKER_RENDER_PLATFORM, 
  WORKER_SCRIPT 
} from 'angular2/platform/worker_render';

const workerScriptUrl = URL.createObjectURL(new Blob([`
  var window = this; 
  var origin = this.location.origin;
  importScripts(origin + '/vendor.js', origin + '/boot_worker.js');
`], { 
    type: 'text/javascript' 
}));

const appRef = platform(WORKER_RENDER_PLATFORM).application([
  WORKER_RENDER_APP,
  provide(WORKER_SCRIPT, { useValue: workerScriptUrl })
])

const worker = appRef.injector.get(WebWorkerInstance).worker;

worker.addEventListener('message', function onAppReady(event) {
  if (event.data === 'APP_READY') {
    setTimeout(() => document.dispatchEvent(new Event('BootstrapComplete')));
    worker.removeEventListener('message', onAppReady, false);
  }
}, false);
