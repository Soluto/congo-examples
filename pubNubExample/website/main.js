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

var startTimeButtonClicks = DOM.click(document.querySelector("#startTimeButton"));
var stopTimeButtonClicks = DOM.click(document.querySelector("#stopTimeButton"));
var timeView = document.querySelector("#timeView");

startTimeButtonClicks
    .flatMap(() => deviceService.getTime().takeUntil(stopTimeButtonClicks))
    .map(time => timeView.innerText = time)
    .subscribe();
// </editor-fold>

//<editor-fold desc="Logs">

var logStartClicks = DOM.click(document.querySelector("#startLogsButton"));
var logStopClicks = DOM.click(document.querySelector("#stopLogsButton"));
var logView = document.querySelector("#logsView");

const getLogs = () => deviceService.getLogs();

const buildLogsHtml = (logs)=> logs.map(log=> `<li>${log}</li>`).join("");

var logs = logStartClicks
    .flatMap(() => getLogs().takeUntil(logStopClicks))
    .distinct()
    .scan((acc, next)=> [next, ...acc], []);

var logFiltersChange = DOM.keyup(document.querySelector("#logsFilter"));

//<editor-fold desc="With Filter">

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

 //</editor-fold>