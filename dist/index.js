/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 25:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 977:
/***/ ((module) => {

module.exports = eval("require")("@actions/exec");


/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(25);
const exec = __nccwpck_require__(977);
const fs = __nccwpck_require__(147);

async function run() {
    const workspace = process.env.GITHUB_WORKSPACE;
    const currentRunnerID = process.env.GITHUB_RUN_ID;
    try {
        await exec.exec(`docker pull cyprox/scan-agent:latest -q`);
        try {
            core.setSecret(core.getInput('api_key'))
            await exec.exec(`docker run -v ${workspace}:/output:rw cyprox/scan-agent --api-key=${core.getInput('api_key')} ${core.getInput('api_url') ? ('--api-url='+core.getInput('api_url')) : ''} --scan-id=${core.getInput('scan_id')} --tag-name=${core.getInput('tag_name') ? core.getInput('tag_name') : ('github-action-'+currentRunnerID)} --o=true`);
        } catch (err) {
            core.setFailed(err.message);
        }
        console.log(`Scanning process completed, starting to analyze the results`);
        const jOutputFile = fs.readFileSync(`${workspace}/output.json`);
        const currentOutput = JSON.parse(jOutputFile.toString());
        if(currentOutput['success']) {
            if(currentOutput['founded'] > 0) {
                const failAction = core.getInput('fail_action');
                warnMsg = `Scan action failed as Cyprox has identified ${currentOutput['founded']} alerts, starting to analyze the results`;
                if(String(failAction).toLowerCase() === 'true') {
                    core.setFailed(warnMsg);
                } else {
                    core.warning(warnMsg);
                }
            }
        } else {
            core.setFailed(`Scan action failed: ${currentOutput['msg']}`);
        }
    } catch (err) {
        core.setFailed(err.message);
    }
}

run();

})();

module.exports = __webpack_exports__;
/******/ })()
;