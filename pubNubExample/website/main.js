//<editor-fold desc="">
import {Observable} from "rx";
Observable.prototype.retryUntilResponse = function(timeout, retryCount) {
    return Observable.amb(this.materialize(), Observable.throw("").delaySubscription(timeout))
        .retry(retryCount)
        .dematerialize();
};
import {DOM} from "rx-dom";
import deviceService from './deviceService';
// </editor-fold>

//<editor-fold desc="Time">
var startClockClicks = DOM.click(document.querySelector("#startTime"));
var stopClockClicks = DOM.click(document.querySelector("#stopTime"));
var timeView = document.querySelector("#timeView");

//const getTime = () => Observable.interval(1000).map(() => new Date());
const getTime = () => deviceService.getTime();

//startClockClicks
//    .flatMap(() => getTime())
//    .takeUntil(stopClockClicks)
//    .map(time => timeView.innerText = time)
//    .repeat()
//    .subscribe();

startClockClicks
    .flatMap(() => getTime().takeUntil(stopClockClicks))
    .map(time => timeView.innerText = time)
    .subscribe();
// </editor-fold>

//<editor-fold desc="Process Count">

var processCountStartClicks = DOM.click(document.querySelector("#startProcessCount"));
var processCountStopClicks = DOM.click(document.querySelector("#stopProcessCount"));
var processCountView = document.querySelector("#processCount");

const getProcessCount = () => deviceService.getRunningProcessesCount().retryUntilResponse(5000, 10);

processCountStartClicks
    .flatMap(() => getProcessCount())
    .distinctUntilChanged()
    .takeUntil(processCountStopClicks)
    .map(processCount => processCountView.innerHTML = processCount)
    .repeat()
    .subscribe();

// </editor-fold>

//<editor-fold desc="Logs">

//var logStartClicks = DOM.click(document.querySelector("#startLogs"));
//var logStopClicks = DOM.click(document.querySelector("#stopLogs"));
//var logView = document.querySelector("#logsView");
//
//const getLogs = () => deviceService.getLogs();
//
//const buildLogsHtml = (logs)=>logs.map(log=> `<li>${log}</li>`).join("");
//
//var logs = logStartClicks
//    .flatMap(() => getLogs().takeUntil(logStopClicks))
//    .distinct()
//    .scan((acc, next)=> [next, ...acc], []);
//
//logs.map(logs=> buildLogsHtml(logs))
//    .subscribe(html => logView.innerHTML = html);
//</editor-fold>

//<editor-fold desc="Logs with Filter">

var logStartClicks = DOM.click(document.querySelector("#startLogs"));
var logStopClicks = DOM.click(document.querySelector("#stopLogs"));
var logView = document.querySelector("#logsView");

const getLogs = () => deviceService.getLogs();

const buildLogsHtml = (logs)=>logs.map(log=> `<li>${log}</li>`).join("");

var logs = logStartClicks
    .flatMap(() => getLogs().takeUntil(logStopClicks))
    .distinct()
    .scan((acc, next)=> [next, ...acc], []);

var logFiltersChange = DOM.keyup(document.querySelector("#logsFilter"));

var logsFilter = logFiltersChange
    .map(e=> e.target.value)
    .startWith("")
    .debounce(300)
    .distinctUntilChanged();

Observable
    .combineLatest(logs,logsFilter, (logs, logsFilter)=> logs.filter(log=> log.includes(logsFilter)))
    .map(logs=> buildLogsHtml(logs))
    .subscribe(html => logView.innerHTML = html);
 //</editor-fold>